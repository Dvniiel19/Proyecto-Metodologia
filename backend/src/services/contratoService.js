

const db = require('../config/db');
const Contrato = require('../entities/contrato.entity');

const contratoRepository = db.getRepository(Contrato);

/**
 * crear un nuevo contrato
 * @param {Object} datosContrato 
 * @return {Object} 
*/

const crearContrato = async (datosContrato) => {
    const nuevoContrato = contratoRepository.create(datosContrato);
    return await contratoRepository.save(nuevoContrato);
};

/**
 * obtener todos los contratos
 * @return {Array} 
 */

const obtenerTodosLosContratos = async () => {
    return await contratoRepository.find();
};

/**
 * obtener contrato por id
 * @param {Number} id_contrato 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerContratoPorId = async (id_contrato) => {
    return await contratoRepository.findOneBy({id_contrato});
};

/**
 * actualizar un contrato existente
 * @param {Number} id_contrato 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarContrato = async (id_contrato, datosActualizados) => {
    await contratoRepository.update(id_contrato,datosActualizados);
    return await obtenerContratoPorId(id_contrato);
}

/**
 * eliminar un contrato
 * @param {Number} id_contrato 
 * @return {Boolean} 
 */

const eliminarContrato= async (id_contrato) => {
    const result = await contratoRepository.delete(id_contrato);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearContrato,
    obtenerTodosLosContratos,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato,
};
