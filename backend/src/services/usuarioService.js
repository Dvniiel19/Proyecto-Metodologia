

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
    const usuarioGuardado = await usuarioRepository.save(nuevoUsuario);
    // save() devuelve el objeto en memoria con el hash incluido; se elimina antes de responder
    delete usuarioGuardado.contrasena;
    return usuarioGuardado;
};

/**
 * obtener todos los usuarios
 * @return {Array} 
 */

const obtenerTodosLosUsuarios = async () => {
    return await usuarioRepository.find();
};

/**
 * obtener usuario por correo(usado para el login)
 * @param {String} correo 
 * @returns {Object | null} 
 */
const obtenerUsuarioPorCorreo = async (correo) => {
    // incluye contrasena explicitamente (tiene select: false) porque el login la compara
    return await usuarioRepository.findOne({
        where: { correo },
        select: ['id_usuario', 'correo', 'contrasena', 'id_rol'],
    });
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
    const result = await usuarioRepository.update(id_usuario, datosActualizados);
    // [MODIFICADO] Verifica affected antes de hacer la segunda consulta.
    // Sin este chequeo se haria un SELECT innecesario aunque el usuario no exista.
    if (result.affected === 0) return null;
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
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarioPorCorreo,
};
