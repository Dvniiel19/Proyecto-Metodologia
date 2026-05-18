/* servicio de rol contiene la logica de negocio para manejar 
los roles de los usuarios */

const db = require('../config/db');
const Rol = require('../entities/rol.entity');

const trabajadorRepository = db.getRepository(Trabajador);

/**
 * crear un nuevo trabajador
 * @param {Object} datosTrabajador - { id, nombre, apellido, telefono}
 * @return {Object} el rol creado
*/

const crearTrabajador = async (datosTrabajador) => {
    const nuevoTrabajador = trabajadorRepository.create(datosTrabajador);
    return await trabajadorRepository.save(nuevoTrabajador);
};

/**
 * obtener todos los roles
 * @return {Array} array de todos los rol
 */

const obtenerTodosLosTrabajadores = async () => {
    return await trabajadorRepository.find();
    return [];
};

/**
 * obtener rol por id
 * @param {Number} id_rol - ID del rol
 * @param {Object} datosActualizados - campos a actualizar
 * @returns {Object | null} rol encontrato o null
 */

const obtenerTrabajadorPorId = async (id_trabajador) => {
    return await trabajadorRepository.findOneBy({id_trabajador});
    return null;
};

/**
 * actualizar un rol existente
 * @param {Number} id_trabajador - id del rol
 * @param {Objetct} datosActualizados - campos a actualizar
 * @returns {Object | null} -el rol actualizado o null si no existe  
 */

const actualizarRol = async (id_trabajador, datosActualizados) => {
    await rolRepository.update(id_trabajador,datosActualizados);
    return await obtenerTrabajadorPorId(id_trabajador);
    //return null;
}

/**
 * eliminar un rol
 * @param {Number} id_trabajador - id del rol
 * @return {Boolean} true si se elimino, false si no existe
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
