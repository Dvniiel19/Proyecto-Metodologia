

const db = require('../config/db');
const Agenda = require('../entities/agenda.entity');
const { ESTADOS_AGENDA } = require('../constants/estadosAgenda');

const agendaRepository = db.getRepository(Agenda);

/**
 * crear una nueva agenda
 * @param {Object} datosAgenda 
 * @return {Object} 
*/

const crearAgenda = async (datosAgenda) => {
    const nuevaAgenda = agendaRepository.create(datosAgenda);
    return await agendaRepository.save(nuevaAgenda);
};

/**
 * obtener todas las agendas
 * @return {Array} 
 */

const obtenerTodasLasAgenda = async () => {
    return await agendaRepository.find();
};

/**
 * obtener las agendas asignadas al trabajador vinculado a un usuario
 * Solo devuelve agendas con una asignacion en asignar_servicio para ese trabajador,
 * excluyendo las ya finalizadas (no tiene sentido fichar entrada en ellas)
 * @param {Number} id_usuario id del usuario autenticado (del token JWT)
 * @return {Array}
 */

const obtenerAgendasPorTrabajador = async (id_usuario) => {
    return await agendaRepository
        .createQueryBuilder('agenda')
        .innerJoin('agenda.asignar_servicio', 'asignacion')
        .innerJoin('asignacion.trabajador', 'trabajador')
        .where('trabajador.id_usuario = :id_usuario', { id_usuario })
        .andWhere('agenda.estado IN (:...estadosActivos)', {
            // solo tiene sentido fichar en servicios aun no terminados
            estadosActivos: [
                ESTADOS_AGENDA.PENDIENTE,
                ESTADOS_AGENDA.PERSONAL_ASIGNADO,
                ESTADOS_AGENDA.EN_PROCESO,
            ],
        })
        .orderBy('agenda.fecha_programada', 'ASC')
        .addOrderBy('agenda.hora_inicio', 'ASC')
        .getMany();
};

/**
 * obtener agenda por id
 * @param {Number} id_servicio
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerAgendaPorId = async (id_servicio) => {
    return await agendaRepository.findOneBy({id_servicio});
};

/**
 * actualizar una agenda existente
 * @param {Number} id_servicio 
 * @param {Object} datosActualizados 
 * @returns {Object | null}
 */

const actualizarAgenda = async (id_servicio, datosActualizados) => {
    await agendaRepository.update(id_servicio,datosActualizados);
    return await obtenerAgendaPorId(id_servicio);
}

/**
 * verificar si una agenda esta asignada al trabajador vinculado a un usuario
 * (se usa para que un Trabajador solo pueda terminar sus propios servicios)
 * @param {Number} id_servicio
 * @param {Number} id_usuario id del usuario autenticado (del token JWT)
 * @return {Boolean}
 */

const esAgendaDelUsuario = async (id_servicio, id_usuario) => {
    const total = await agendaRepository
        .createQueryBuilder('agenda')
        .innerJoin('agenda.asignar_servicio', 'asignacion')
        .innerJoin('asignacion.trabajador', 'trabajador')
        .where('agenda.id_servicio = :id_servicio', { id_servicio })
        .andWhere('trabajador.id_usuario = :id_usuario', { id_usuario })
        .getCount();
    return total > 0;
};

/**
 * marcar el trabajo de un servicio como terminado (Operaciones)
 * Transicion permitida: 'En Proceso' -> 'Pendiente de Evaluacion'.
 * Deja el servicio habilitado para que el cliente lo evalue.
 * @param {Number} id_servicio
 * @param {String | undefined} observacion_final observacion opcional del trabajador
 * @returns {Object | null} agenda actualizada, null si no existe,
 *                          { error: 'estado_invalido', estadoActual } si la transicion no corresponde
 */

const terminarTrabajo = async (id_servicio, observacion_final) => {
    const agenda = await agendaRepository.findOneBy({ id_servicio: Number(id_servicio) });
    if (!agenda) return null;

    if (agenda.estado !== ESTADOS_AGENDA.EN_PROCESO) {
        return { error: 'estado_invalido', estadoActual: agenda.estado };
    }

    await agendaRepository.update(id_servicio, {
        estado: ESTADOS_AGENDA.PENDIENTE_EVALUACION,
        observacion_final: observacion_final ?? null,
    });
    return await obtenerAgendaPorId(Number(id_servicio));
};

/**
 * eliminar una agenda
 * @param {Number} id_servicio 
 * @return {Boolean} 
 */

const eliminarAgenda = async (id_servicio) => {
    const result = await agendaRepository.delete(id_servicio);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearAgenda,
    obtenerTodasLasAgenda,
    obtenerAgendasPorTrabajador,
    obtenerAgendaPorId,
    actualizarAgenda,
    eliminarAgenda,
    esAgendaDelUsuario,
    terminarTrabajo,
};
