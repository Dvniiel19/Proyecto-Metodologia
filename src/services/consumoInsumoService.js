

const db = require('../config/db');
const ConsumoInsumo = require('../entities/consumoInsumo.entity');

const consumoRepository = db.getRepository(ConsumoInsumo);

/**
 * crear un nuevo consumo de insumo
 * @param {Object} datosConsumo 
 * @return {Object} 
*/

const crearConsumo = async (datosConsumo) => {
    const nuevoConsumo = consumoRepository.create(datosConsumo);
    return await consumoRepository.save(nuevoConsumo);
};

/**
 * obtener todos los roles
 * @return {Array} array de todos los rol
 */

const obtenerTodosLosConsumos = async () => {
    return await consumoRepository.find();
};

/**
 * obtener consumo por id
 * @param {Number} id_consumo 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerConsumoPorId = async (id_consumo) => {
    return await consumoRepository.findOneBy({id_consumo});
};

/**
 * actualizar un consumo existente
 * @param {Number} id_consumo 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarConsumo = async (id_consumo, datosActualizados) => {
    await consumoRepository.update(id_consumo,datosActualizados);
    return await obtenerConsumoPorId(id_consumo);
}

/**
 * eliminar un consumo
 * @param {Number} id_consumo 
 * @return {Boolean} 
 */

const eliminarConsumo = async (id_consumo) => {
    const result = await consumoRepository.delete(id_consumo);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearConsumo,
    obtenerTodosLosConsumos,
    obtenerConsumoPorId,
    actualizarConsumo,
    eliminarConsumo,
};
