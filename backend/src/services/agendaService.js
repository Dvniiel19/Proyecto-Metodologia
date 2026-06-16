

const db = require('../config/db');
const Agenda = require('../entities/agenda.entity');

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
    obtenerAgendaPorId,
    actualizarAgenda,
    eliminarAgenda,
};
