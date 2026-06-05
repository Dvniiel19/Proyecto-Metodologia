

const db = require('../config/db');
const ValidacionSupervisor = require('../entities/validacionSupervisor.entity');

const validacionRepository = db.getRepository(ValidacionSupervisor);

/**
 * crear una validacion
 * @param {Object} datosValidacion 
 * @return {Object} 
*/

const crearValidacion= async (datosValidacion) => {
    const nuevaValidacion = validacionRepository.create(datosValidacion);
    return await validacionRepository.save(nuevaValidacion);
};

/**
 * obtener todas las validaciones
 * @return {Array}
 */

const obtenerTodasLasValidaciones = async () => {
    return await validacionRepository.find();
};

/**
 * obtener validacion por id
 * @param {Number} id_validacion
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerValidacionPorId = async (id_validacion) => {
    return await validacionRepository.findOneBy({id_validacion});
};

/**
 * actualizar un validacion existente
 * @param {Number} id_validacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarValidacion = async (id_validacion, datosActualizados) => {
    await validacionRepository.update(id_validacion,datosActualizados);
    return await obtenerValidacionPorId(id_validacion);
}

/**
 * eliminar una validacion
 * @param {Number} id_validacion 
 * @return {Boolean} 
 */

const eliminarValidacion = async (id_validacion) => {
    const result = await validacionRepository.delete(id_validacion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearValidacion,
    obtenerTodasLasValidaciones,
    obtenerValidacionPorId,
    actualizarValidacion,
    eliminarValidacion,
};
