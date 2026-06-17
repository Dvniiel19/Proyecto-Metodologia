

const db = require('../config/db');
const Usuario = require('../entities/usuario.entity');

const usuarioRepository = db.getRepository(Usuario);

/**
 * crear un nuevo usuario
 * @param {Object} datosUsuario 
 * @return {Object}
*/

const crearUsuario = async (datosUsuario) => {
    const nuevoUsuario = usuarioRepository.create(datosUsuario);
    return await usuarioRepository.save(nuevoUsuario);
};

/**
 * obtener todos los usuarios
 * @return {Array} 
 */

const obtenerTodosLosUsuarios = async () => {
    return await usuarioRepository.find();
};

/**
 * obtener usuario por correo
 * @param {String} correo 
 * @returns {Object | null}
 */

const obtenerUsuarioPorCorreo = async (correo) => {
    return await usuarioRepository.findOneBy({ correo });
};

/**
 * obtener usuario por id
 * @param {Number} id_usuario 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerUsuarioPorId = async (id_usuario) => {
    return await usuarioRepository.findOneBy({id_usuario});
};

/**
 * actualizar un usuario existente
 * @param {Number} id_usuario 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarUsuario = async (id_usuario, datosActualizados) => {
    await usuarioRepository.update(id_usuario,datosActualizados);
    return await obtenerUsuarioPorId(id_usuario);
}

/**
 * eliminar un usuario
 * @param {Number} id_usuario 
 * @return {Boolean} 
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
    obtenerUsuarioPorCorreo,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
};
