

const db = require('../config/db');
const Transaccion = require('../entities/transacciones.entity');

const TransaccionRepository = db.getRepository(Transaccion);

/**
 * crear un nueva nueva transaccion
 * @param {Object} datosTransaccion 
 * @return {Object} 
*/

const crearTransaccion = async (datosTransaccion) => {
    const nuevaTransaccion = TransaccionRepository.create(datosTransaccion);
    return await TransaccionRepository.save(nuevaTransaccion);
}; 

/**
 * obtener todas las transacciones
 * @return {Array} 
 */

const obtenerTodasLasTransacciones = async () => {
    return await TransaccionRepository.find();
};

/**
 * obtener transaccion por id
 * @param {Number} id_transaccion
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerTransaccionPorId = async (id_transaccion) => {
    return await TransaccionRepository.findOneBy({id_transaccion});
};

/**
 * actualizar una transaccion existente
 * @param {Number} id_transaccion
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */


const actualizarTransaccion = async (id_transaccion, datosActualizados) => {
    await TransaccionRepository.update(id_transaccion,datosActualizados);
    return await obtenerTransaccionPorId(id_transaccion);
}

/**
 * eliminar un transaccion
 * @param {Number} id_transaccion 
 * @return {Boolean} 
 */

const eliminarTransaccion = async (id_transaccion) => {
    const result = await TransaccionRepository.delete(id_transaccion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearTransaccion,
    obtenerTodasLasTransacciones,
    obtenerTransaccionPorId,
    actualizarTransaccion,
    eliminarTransaccion,
};
