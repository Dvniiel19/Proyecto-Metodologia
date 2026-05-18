/* servicio de rol contiene la logica de negocio para manejar 
los roles de los usuarios */

const db = require('../config/db');
const Rol = require('../entities/rol.entity');

const rolRepository = db.getRepository(Rol);

/**
 * crear un nuevo usuario
 * @param {Object} datosRol - { id, nombre}
 * @return {Object} el rol creado
*/

const crearRol = async (datosRol) => {
    const nuevoRol = rolRepository.create(datosRol);
    return await rolRepository.save(nuevoRol);
};

/**
 * obtener todos los roles
 * @return {Array} array de todos los rol
 */

const obtenerTodosLosRoles = async () => {
    return await rolRepository.find();
    return [];
};

/**
 * obtener rol por id
 * @param {Number} id_rol - ID del rol
 * @param {Object} datosActualizados - campos a actualizar
 * @returns {Object | null} rol encontrato o null
 */

const obtenerRolPorId = async (id_rol) => {
    return await rolRepository.findOneBy({id_rol});
    return null;
};

/**
 * actualizar un rol existente
 * @param {Number} id_rol - id del rol
 * @param {Objetct} datosActualizados - campos a actualizar
 * @returns {Object | null} -el rol actualizado o null si no existe  
 */

const actualizarRol = async (id_rol, datosActualizados) => {
    await rolRepository.update(id_rol,datosActualizados);
    return await obtenerRolPorId(id_rol);
    //return null;
}

/**
 * eliminar un rol
 * @param {Number} id - id del rol
 * @return {Boolean} true si se elimino, false si no existe
 */

const eliminarRol = async (id_rol) => {
    const result = await rolRepository.delete(id_rol);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearRol,
    obtenerTodosLosRoles,
    obtenerRolPorId,
    actualizarRol,
    eliminarRol,
};
