

const db = require('../config/db');
const insumosEntity = require('../entities/insumos.entity');
const Insumos = require('../entities/insumos.entity');

const insumosRepository = db.getRepository(Insumos);

/**
 * crear un nuevo insumo
 * @param {Object} datosInsumos 
 * @return {Object} 
*/

const crearInsumos = async (datosInsumos) => {
    const nuevoInsumo = insumosRepository.create(datosInsumos);
    return await insumosRepository.save(nuevoInsumo);
};

/**
 * obtener todos los insumos
 * @return {Array}
 */

const obtenerTodosLosInsumos = async () => {
    return await insumosRepository.find();
};

/**
 * obtener insumo por id
 * @param {Number} id_insumo 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerInsumoPorId = async (id_insumo) => {
    return await insumosRepository.findOneBy({id_insumo});
};

/**
 * actualizar un insumo existente
 * @param {Number} id_insumo
 * @param {Object} datosActualizados
 * @returns {Object | null} 
 */

const actualizarInsumo = async (id_insumo, datosActualizados) => {
    await insumosRepository.update(id_insumo,datosActualizados);
    return await obtenerInsumoPorId(id_insumo);
}

/**
 * eliminar un insumo
 * @param {Number} id_insumo 
 * @return {Boolean} 
 */

const eliminarInsumo = async (id_insumo) => {
    const result = await insumosRepository.delete(id_insumo);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearInsumos,
    obtenerTodosLosInsumos,
    obtenerInsumoPorId,
    actualizarInsumo,
    eliminarInsumo,
};
