

const db = require('../config/db');
const ValidacionSupervisor = require('../entities/validacionSupervisor.entity');

const validacionRepository = db.getRepository(ValidacionSupervisor);

/**
 * crear una validacion
 * @param {Object} datosValidacion 
 * @return {Object} 
*/

const crearValidacionSupervisor = async (datosValidacion) => {
    const nuevaValidacion = validacionRepository.create(datosValidacion);
    return await validacionRepository.save(nuevaValidacion);
};

/**
 * obtener todas las validaciones
 * @return {Array}
 */

const obtenerTodasLasValidacioneSupervisor = async () => {
    return await validacionRepository.find();
};

/**
 * obtener validacion por id
 * @param {Number} id_validacion
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerValidacionSupervisorPorId= async (id_validacion) => {
    return await validacionRepository.findOneBy({id_validacion});
};

/**
 * actualizar un validacion existente
 * @param {Number} id_validacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarValidacionSupervisor = async (id_validacion, datosActualizados) => {
    await validacionRepository.update(id_validacion,datosActualizados);
    return await obtenerValidacionSupervisorPorId(id_validacion);
}

/**
 * eliminar una validacion
 * @param {Number} id_validacion 
 * @return {Boolean} 
 */

const  eliminarValidacionSupervisor= async (id_validacion) => {
    const result = await validacionRepository.delete(id_validacion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearValidacionSupervisor,
    obtenerTodasLasValidacioneSupervisor,
    obtenerValidacionSupervisorPorId,
    actualizarValidacionSupervisor,
    eliminarValidacionSupervisor,
};
