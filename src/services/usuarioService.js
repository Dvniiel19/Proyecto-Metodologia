/* servicio de rol contiene la logica de negocio para manejar 
los roles de los usuarios */

const db = require('../config/db');
const Usuario = require('../entities/rol.entity');

const usuarioRepository = db.getRepository(Usuario);

/**
 * crear un nuevo usuario
 * @param {Object} datosUsuario - { id, correo, contraseña}
 * @return {Object} el usuario creado
*/

const crearUsuario = async (datosUsuario) => {
    const nuevoUsuario = usuarioRepository.create(datosUsuario);
    return await usuarioRepository.save(nuevoUsuario);
};

/**
 * obtener todos los roles
 * @return {Array} array de todos los rol
 */

const obtenerTodosLosUsuarios = async () => {
    return await usuarioRepository.find();
    return [];
};

/**
 * obtener rol por id
 * @param {Number} id_usuario - ID del rol
 * @param {Object} datosActualizados - campos a actualizar
 * @returns {Object | null} rol encontrato o null
 */

const obtenerUsuarioPorId = async (id_usuario) => {
    return await usuarioRepository.findOneBy({id_usuario});
    return null;
};

/**
 * actualizar un rol existente
 * @param {Number} id_usuario - id del rol
 * @param {Objetct} datosActualizados - campos a actualizar
 * @returns {Object | null} -el rol actualizado o null si no existe  
 */

const actualizarUsuario = async (id_usuario, datosActualizados) => {
    await usuarioRepository.update(id_usuario,datosActualizados);
    return await obtenerRolPorId(id_usuario);
    //return null;
}

/**
 * eliminar un rol
 * @param {Number} id_usuario - id del rol
 * @return {Boolean} true si se elimino, false si no existe
 */

const eliminarUsuario = async (id_usuario) => {
    const result = await usuarioRepository.delete(id_usuario);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
};
