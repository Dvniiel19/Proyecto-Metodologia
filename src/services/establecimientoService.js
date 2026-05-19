

const db = require('../config/db');
const Establecimiento = require('../entities/establecimiento.entity');

const establecimientoRepository = db.getRepository(Establecimiento);

/**
 * crear un nuevo establecimiento
 * @param {Object} datosEstablecimiento 
 * @return {Object}
*/

const crearEstablecimiento = async (datosEstablecimiento)=> {
    const nuevoEstablecimiento = establecimientoRepository.create(datosEstablecimiento);
    return await establecimientoRepository.save(nuevoEstablecimiento);
};

/**
 * obtener todos los establecimientos
 * @return {Array} 
 */

const obtenerTodosLosEstablecimientos = async () => {
    return await establecimientoRepository.find();
};

/**
 * obtener establecimiento por id
 * @param {Number} id_establecimiento
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerEstablecimientoPorId = async (id_establecimiento) => {
    return await establecimientoRepository.findOneBy({id_establecimiento});
};

/**
 * actualizar un establecimiento existente
 * @param {Number} id_establecimiento 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarEstablecimiento = async (id_establecimiento, datosActualizados) => {
    await establecintoRepository.update(id_establecimiento,datosActualizados);
    return await obtenerRolPorId(id_rol);
}

/**
 * eliminar un establecimiento
 * @param {Number} id_establecimiento 
 * @return {Boolean} 
 */

const eliminarEstablecimiento = async (id_establecimiento) => {
    const result = await establecimientoRepository.delete(id_establecimiento);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearEstablecimiento,
    obtenerTodosLosEstablecimientos,
    obtenerEstablecimientoPorId,
    actualizarEstablecimiento,
    eliminarEstablecimiento,
};
