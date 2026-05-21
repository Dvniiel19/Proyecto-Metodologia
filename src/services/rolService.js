

const db = require('../config/db');
const Rol = require('../entities/rol.entity');

const rolRepository = db.getRepository(Rol);

/**
 * crear un nuevo rol
 * @param {Object} datosRol 
 * @return {Object} 
*/

const crearRol = async (datosRol) => {
    const nuevoRol = rolRepository.create(datosRol);
    return await rolRepository.save(nuevoRol);
}; 

/**
 * obtener todos los roles
 * @return {Array} 
 */

const obtenerTodosLosRoles = async () => {
    return await rolRepository.find();
};

/**
 * obtener rol por id
 * @param {Number} id_rol 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerRolPorId = async (id_rol) => {
    return await rolRepository.findOneBy({id_rol});
};

/**
 * actualizar un rol existente
 * @param {Number} id_rol
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */


const actualizarRol = async (id_rol, datosActualizados) => {
    await rolRepository.update(id_rol,datosActualizados);
    return await obtenerRolPorId(id_rol);
}

/**
 * eliminar un rol
 * @param {Number} id_rol 
 * @return {Boolean} 
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
