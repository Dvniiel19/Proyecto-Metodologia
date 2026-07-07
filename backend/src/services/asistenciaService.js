

const { In, IsNull } = require('typeorm');
const db = require('../config/db');
const Asistencia = require('../entities/asistencia.entity');
const { ESTADOS_AGENDA } = require('../constants/estadosAgenda');

const asistenciaRepository = db.getRepository(Asistencia);
const agendaRepository = db.getRepository('Agenda');
const asignarServicioRepository = db.getRepository('AsignarServicio');

/**
 * crear una asistencia 
 * @param {Object} datosAsistencia  
 * @return {Object} 
*/

const crearAsistencia  = async (datosAsistencia ) => {
    const nuevaAsistencia = asistenciaRepository.create(datosAsistencia);
    return await asistenciaRepository.save(nuevaAsistencia);
};

/**
 * obtener todas las asistencias
 * @return {Array}
 */

const obtenerTodasLasAsistencias = async () => {
    return await asistenciaRepository.find();
};

/**
 * obtener asistencia por id
 * @param {Number} id_asistencia 
 * @param {Object} datosActualizados
 * @returns {Object | null}
 */

const obtenerAsistenciaPorId = async (id_asistencia) => {
    return await asistenciaRepository.findOneBy({id_asistencia});
};

/**
 * actualizar una asistencia existente
 * @param {Number} id_asistencia 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarAsistencia = async (id_asistencia, datosActualizados) => {
    const result = await asistenciaRepository.update(id_asistencia, datosActualizados);
    if (result.affected === 0) return null;
    return await obtenerAsistenciaPorId(id_asistencia);
}

/**
 * registrar entrada (reloj control) — genera fecha y hora_entrada automaticamente
 * @param {Number} id_trabajador
 * @param {Number} id_servicio
 * @returns {Object}
 */
// Reloj control — entrada. Genera fecha (YYYY-MM-DD) y hora_entrada (HH:MM:SS) automaticamente
// para que el trabajador solo envie su id y el id del servicio al que asiste.
const registrarEntrada = async (id_trabajador, id_servicio) => {
    // Si el trabajador ya tiene una entrada sin salida, no se permite fichar de nuevo
    const entradaAbierta = await asistenciaRepository.findOneBy({
        id_trabajador: Number(id_trabajador),
        hora_salida: IsNull(),
    });
    if (entradaAbierta) return { error: 'entrada_abierta' };

    const ahora = new Date();
    // fecha en hora local (toISOString usa UTC y de noche daria el dia siguiente)
    const fecha = [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, '0'),
        String(ahora.getDate()).padStart(2, '0'),
    ].join('-');
    const hora_entrada = ahora.toTimeString().split(' ')[0]; // formato HH:MM:SS

    const nuevaAsistencia = asistenciaRepository.create({ id_trabajador, id_servicio, fecha, hora_entrada });
    const asistenciaGuardada = await asistenciaRepository.save(nuevaAsistencia);

    // Al fichar la primera entrada, el servicio pasa a 'En Proceso' (desde
    // 'Pendiente' o 'Personal Asignado'). Se filtra por estado en el WHERE
    // para no pisar servicios ya terminados o cancelados.
    await agendaRepository.update(
        {
            id_servicio: Number(id_servicio),
            estado: In([ESTADOS_AGENDA.PENDIENTE, ESTADOS_AGENDA.PERSONAL_ASIGNADO]),
        },
        { estado: ESTADOS_AGENDA.EN_PROCESO }
    );

    return asistenciaGuardada;
};

/**
 * registrar salida (reloj control) — completa el registro con hora_salida
 * @param {Number} id_asistencia
 * @returns {Object | null}
 */
// REGLA DE NEGOCIO (cierre colectivo): la salida de UN trabajador no puede
// finalizar un servicio donde trabajan varios. Solo cuando TODOS los
// trabajadores asignados en asignar_servicio cerraron su jornada (ficharon
// salida o fueron asentados como 'Ausente'), el servicio pasa de 'En Proceso'
// a 'Pendiente de Evaluacion' para que el cliente lo evalue.
// Si un asignado nunca ficho ni fue marcado ausente, el servicio queda
// 'En Proceso' y un supervisor puede cerrarlo manualmente via
// PUT /agenda/:id/terminar-trabajo.
const cerrarServicioSiTodosSalieron = async (id_servicio) => {
    const asignaciones = await asignarServicioRepository.findBy({
        id_servicio: Number(id_servicio),
    });
    // sin asignaciones registradas no hay contra que comparar: no se auto-cierra
    if (asignaciones.length === 0) return false;
    const idsAsignados = [...new Set(asignaciones.map((a) => a.id_trabajador))];

    // Un trabajador "cerro su jornada" si tiene una asistencia del servicio
    // con hora_salida registrada o quedo asentado como 'Ausente'
    const asistenciasDelServicio = await asistenciaRepository.findBy({
        id_servicio: Number(id_servicio),
    });
    const idsCerrados = new Set(
        asistenciasDelServicio
            .filter((a) => a.hora_salida != null || a.estado_asistencia === 'Ausente')
            .map((a) => a.id_trabajador)
    );

    const todosSalieron = idsAsignados.every((id) => idsCerrados.has(id));
    if (!todosSalieron) return false;

    // El WHERE por estado evita pisar servicios ya evaluados o cancelados
    await agendaRepository.update(
        { id_servicio: Number(id_servicio), estado: ESTADOS_AGENDA.EN_PROCESO },
        { estado: ESTADOS_AGENDA.PENDIENTE_EVALUACION }
    );
    return true;
};

// Reloj control — salida. Completa el registro existente con hora_salida.
// Si la salida ya fue registrada, retorna { error: 'ya_registrada' } para que el controller devuelva 409.
// Luego evalua el cierre colectivo del servicio (ver cerrarServicioSiTodosSalieron).
const registrarSalida = async (id_asistencia) => {
    const asistencia = await obtenerAsistenciaPorId(id_asistencia);
    if (!asistencia) return null;
    if (asistencia.hora_salida) return { error: 'ya_registrada' }; // evita registrar salida dos veces

    const hora_salida = new Date().toTimeString().split(' ')[0];
    await asistenciaRepository.update(id_asistencia, { hora_salida });
    await cerrarServicioSiTodosSalieron(asistencia.id_servicio);
    return await obtenerAsistenciaPorId(id_asistencia);
};

/**
 * registrar inasistencia — asienta manualmente la ausencia de un trabajador
 * @param {Number} id_trabajador
 * @param {Number} id_servicio
 * @param {String} fecha formato YYYY-MM-DD
 * @returns {Object}
 */
// Registro manual de ausencia (lo asienta un supervisor/coordinador).
// Si ya existe un registro para ese trabajador/servicio/fecha retorna
// { error: 'ya_registrada' } para que el controller devuelva 409.
const registrarInasistencia = async (id_trabajador, id_servicio, fecha) => {
    const yaRegistrada = await asistenciaRepository.findOneBy({
        id_trabajador: Number(id_trabajador),
        id_servicio: Number(id_servicio),
        fecha,
    });
    if (yaRegistrada) return { error: 'ya_registrada' };

    const nuevaInasistencia = asistenciaRepository.create({
        id_trabajador: Number(id_trabajador),
        id_servicio: Number(id_servicio),
        fecha,
        hora_entrada: null, // una ausencia no tiene hora de entrada
        estado_asistencia: 'Ausente',
    });
    const inasistenciaGuardada = await asistenciaRepository.save(nuevaInasistencia);

    // Marcar al ausente puede ser el ultimo cierre que faltaba para el servicio
    await cerrarServicioSiTodosSalieron(id_servicio);

    return inasistenciaGuardada;
};

/**
 * obtener asistencias de un trabajador especifico
 * @param {Number} id_trabajador
 * @returns {Array}
 */
// [AGREGADO] Devuelve el historial completo de asistencias de un trabajador.
// Se convierte id_trabajador a Number porque params de Express llegan como string.
const obtenerAsistenciasPorTrabajador = async (id_trabajador) => {
    return await asistenciaRepository.findBy({ id_trabajador: Number(id_trabajador) });
};

/**
 * eliminar una asistencia
 * @param {Number} id_asistencia - 
 * @return {Boolean}
 */

const eliminarAsistencia = async (id_asistencia) => {
    const result = await asistenciaRepository.delete(id_asistencia);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearAsistencia,
    obtenerTodasLasAsistencias,
    obtenerAsistenciaPorId,
    actualizarAsistencia,
    eliminarAsistencia,
    registrarEntrada,
    registrarSalida,
    registrarInasistencia,
    obtenerAsistenciasPorTrabajador,
};
