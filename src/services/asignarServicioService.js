

const db = require('../config/db');
const AsignarServicio = require('../entities/asignarServicio.entity');

const asignarServicioRepository = db.getRepository(AsignarServicio);

/**
 * crear una asignacion de servicio
 * @param {Object} datosAsignarServicio 
 * @return {Object} 
*/

const crearAsignacion = async (datosAsignarServicio) => {
    const nuevaAsignacion = asignarServicioRepository.create(datosAsignarServicio);
    return await asignarServicioRepository.save(nuevaAsignacion);
};

/**
 * obtener todas las asignaciones de servicio
 * @return {Array} 
 */

const obtenerTodasLasAsignaciones = async () => {
    return await asignarServicioRepository.find(); 
};

/**
 * obtener asignacion por id
 * @param {Number} id_asignacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerAsignacionPorId = async (id_asignacion) => {
    return await asignarServicioRepository.findOneBy({id_asignacion});
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
