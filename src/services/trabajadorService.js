

const db = require('../config/db');
const Trabajador = require('../entities/trabajador.entity');

const trabajadorRepository = db.getRepository(Trabajador);

/**
 * crear un nuevo trabajador
 * @param {Object} datosTrabajador 
 * @return {Object} 
*/

const crearTrabajador = async (datosTrabajador) => {
    const nuevoTrabajador = trabajadorRepository.create(datosTrabajador);
    return await trabajadorRepository.save(nuevoTrabajador);
};

/**
 * obtener todos los trabajadores
 * @return {Array} 
 */

const obtenerTodosLosTrabajadores = async () => {
    return await trabajadorRepository.find();
};

/**
 * obtener trabajadores por id
 * @param {Number} id_rol 
 * @param {Object} datosActualizados 
 * @returns {Object | null}
 */

const obtenerTrabajadorPorId = async (id_trabajador) => {
    return await trabajadorRepository.findOneBy({id_trabajador});
};

/**
 * actualizar un trabajador existente
 * @param {Number} id_trabajador 
 * @param {Object} datosActualizados -
 * @returns {Object | null}
 */

const actualizarTrabajador = async (id_trabajador, datosActualizados) => {
    await trabajadorRepository.update(id_trabajador,datosActualizados);
    return await obtenerTrabajadorPorId(id_trabajador);
}

/**
 * eliminar un trabajador
 * @param {Number} id_trabajador 
 * @return {Boolean} 
 */

const eliminarTrabajador = async (id_trabajador) => {
    const result = await trabajadorRepository.delete(id_trabajador);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearTrabajador,
    obtenerTodosLosTrabajadores,
    obtenerTrabajadorPorId,
    actualizarTrabajador,
    eliminarTrabajador,
};
