

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

const crearAsignacion = async (datosAsignarServicio) => {
    const { id_servicio, id_trabajador } = datosAsignarServicio;

    // 1. Verificar que la jornada existe
    const jornada = await agendaRepository.findOneBy({ id_servicio });
    if (!jornada) {
        const error = new Error('La jornada de limpieza no existe');
        error.statusCode = 404;
        throw error;
    }

    // 2. Verificar que la jornada no haya iniciado aún
    const ahora = new Date();
    const fechaHoraInicio = new Date(`${jornada.fecha_programada}T${jornada.hora_inicio}`);
    if (ahora >= fechaHoraInicio) {
        const error = new Error('No se puede asignar: la jornada ya inició o está en curso');
        error.statusCode = 400;
        throw error;
    }

    // 3. Verificar cruces de horario del trabajador
    const asignacionesExistentes = await asignarServicioRepository.find({
        where: { trabajador: { id_trabajador } },
        relations: ['agenda'],
    });

    const hayCruce = asignacionesExistentes.some(asig => {
        const otraJornada = asig.agenda;
        if (!otraJornada) return false;
        if (otraJornada.fecha_programada !== jornada.fecha_programada) return false;

        const inicioNueva = new Date(`${jornada.fecha_programada}T${jornada.hora_inicio}`);
        const finNueva   = new Date(`${jornada.fecha_programada}T${jornada.hora_fin}`);
        const inicioOtra = new Date(`${otraJornada.fecha_programada}T${otraJornada.hora_inicio}`);
        const finOtra    = new Date(`${otraJornada.fecha_programada}T${otraJornada.hora_fin}`);

        return inicioNueva < finOtra && finNueva > inicioOtra;
    });

    if (hayCruce) {
    const error = new Error('El operario ya tiene una jornada en ese rango de horas');
    error.statusCode = 409;
    throw error;
    }

    // 4. Crear la asignación
    const nuevaAsignacion = asignarServicioRepository.create(datosAsignarServicio);
    await asignarServicioRepository.save(nuevaAsignacion);

    // 5. Cambiar estado de la jornada a "Personal Asignado"
    await agendaRepository.update(id_servicio, { estado: 'Personal Asignado' });

    // 6. Generar notificación al operario
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
