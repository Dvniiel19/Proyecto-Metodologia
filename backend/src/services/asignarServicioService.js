

const db = require('../config/db');
const AsignarServicio = require('../entities/asignarServicio.entity');
const Agenda = require('../entities/agenda.entity');
const Notificacion = require('../entities/notificacion.entity');


const asignarServicioRepository = db.getRepository(AsignarServicio);
const agendaRepository = db.getRepository(Agenda);
const notificacionRepository = db.getRepository(Notificacion);

/**
 * crear una asignacion de servicio
 * @param {Object} datosAsignarServicio 
 * @return {Object} 
*/

// Asignar un trabajador a una jornada aplica 3 validaciones
// y luego encadena 3 efectos: crear la asignacion, actualizar la jornada y notificar.
// Los errores llevan statusCode para que el controller responda el codigo HTTP correcto
// (404 no existe / 400 ya finalizo / 409 conflicto de horario) en vez de un 500 generico.
const crearAsignacion = async (datosAsignarServicio) => {
    const { id_servicio, id_trabajador } = datosAsignarServicio;

    // 1. Verificar que la jornada existe
    const jornada = await agendaRepository.findOneBy({ id_servicio });
    if (!jornada) {
        const error = new Error('La jornada de limpieza no existe');
        error.statusCode = 404;
        throw error;
    }

    // 2. Verificar que la jornada no haya finalizado: se permite asignar mientras
    // este pendiente o en curso (ej: reforzar personal en una jornada ya iniciada).
    // Se arma la fecha/hora de fin combinando fecha_programada (YYYY-MM-DD) con
    // hora_fin (HH:MM:SS); si no tiene hora_fin, la jornada vale todo el dia
    const ahora = new Date();
    const fechaHoraFin = new Date(`${jornada.fecha_programada}T${jornada.hora_fin || '23:59:59'}`);
    if (ahora >= fechaHoraFin) {
        const error = new Error('No se puede asignar: la jornada ya finalizó');
        error.statusCode = 400;
        throw error;
    }

    // 3. Verificar cruces de horario del trabajador directamente en la base de datos.
    // Formula de solapamiento de intervalos: dos rangos se cruzan si y solo si cada uno
    // empieza antes de que termine el otro (inicioNueva < finOtra AND finNueva > inicioOtra).
    // getExists() genera un SELECT EXISTS: no se trae el historial de turnos a memoria,
    // Postgres responde solo true/false sin importar cuantas asignaciones tenga el trabajador
    const hayCruce = await asignarServicioRepository
        .createQueryBuilder('asignacion')
        .innerJoin('asignacion.agenda', 'otraJornada')
        .where('asignacion.id_trabajador = :id_trabajador', { id_trabajador })
        .andWhere('otraJornada.fecha_programada = :fecha', { fecha: jornada.fecha_programada })
        .andWhere('otraJornada.hora_inicio < :finNueva', { finNueva: jornada.hora_fin })
        .andWhere('otraJornada.hora_fin > :inicioNueva', { inicioNueva: jornada.hora_inicio })
        .getExists();

    if (hayCruce) {
    const error = new Error('El operario ya tiene una jornada en ese rango de horas');
    error.statusCode = 409; // 409 Conflict: el recurso choca con el estado actual del sistema
    throw error;
    }

    // 4. Crear la asignacion
    const nuevaAsignacion = asignarServicioRepository.create(datosAsignarServicio);
    await asignarServicioRepository.save(nuevaAsignacion);

    // 5. Cambiar estado de la jornada a "Personal Asignado"
    await agendaRepository.update(id_servicio, { estado: 'Personal Asignado' });

    // 6. Generar notificacion al operario para que sepa que tiene una jornada nueva
    const notificacion = notificacionRepository.create({
    mensaje: `Has sido asignado a una jornada de limpieza el ${jornada.fecha_programada} de ${jornada.hora_inicio} a ${jornada.hora_fin}`,
    leida: false,
    trabajador: { id_trabajador },
    });
    await notificacionRepository.save(notificacion);

    return nuevaAsignacion;
};

/**
 * obtener todas las asignaciones de servicio
 * @return {Array} 
 */

const obtenerTodasLasAsignaciones = async () => {
    return await asignarServicioRepository.find({
    relations: ['agenda', 'trabajador', 'usuario'],
    });
};

/**
 * obtener asignacion por id
 * @param {Number} id_asignacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerAsignacionPorId = async (id_asignacion) => {
    return await asignarServicioRepository.findOne({
    where: { id_asignacion },
    relations: ['agenda', 'trabajador', 'usuario'],
    });
};

/**
 * actualizar una asignacion existente
 * @param {Number} id_asignacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null}   
 */

const actualizarAsignacion = async (id_asignacion, datosActualizados) => {
    await asignarServicioRepository.update(id_asignacion,datosActualizados);
    return await obtenerAsignacionPorId(id_asignacion);
}

/**
 * eliminar una asignacion 
 * @param {Number} id_asignacion  
 * @return {Boolean}
 */

const eliminarAsignacion = async (id_asignacion) => {
    const result = await asignarServicioRepository.delete(id_asignacion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearAsignacion,
    obtenerTodasLasAsignaciones,
    obtenerAsignacionPorId,
    actualizarAsignacion,
    eliminarAsignacion,
};
