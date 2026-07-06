

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
 * registro unificado: crea el Usuario y su perfil (Cliente o Trabajador)
 * dentro de una unica transaccion de base de datos
 * @param {Object} datos - correo, contrasena (ya hasheada), id_rol, nombre, apellido, telefono, direccion?
 * @param {String} nombreRol - nombre del rol ya resuelto por el controller
 * @return {Object} { usuario, perfil }
 */
// Si cualquier paso falla (ej: el perfil no pasa una constraint),
// TypeORM hace ROLLBACK de todo: nunca queda un Usuario huerfano sin perfil.
const registroUnificado = async (datos, nombreRol) => {
    const { correo, contrasena, id_rol, nombre, apellido, telefono, direccion } = datos;

    return await db.transaction(async (manager) => {
        // 1. Crear las credenciales dentro de la transaccion
        const usuarioRepo = manager.getRepository(Usuario);
        const usuarioGuardado = await usuarioRepo.save(
            usuarioRepo.create({ correo, contrasena, id_rol }),
        );

        // 2. Crear el perfil segun el rol, vinculado al usuario recien creado.
        // Cliente recibe perfil Cliente; cualquier rol de personal (Trabajador,
        // Supervisor, Coordinador, GestorInventario) recibe perfil Trabajador:
        // ahi viven nombre/apellido/telefono y todos pueden fichar asistencia.
        let perfil = null;
        if (nombreRol === 'Cliente') {
            const clienteRepo = manager.getRepository('Cliente');
            perfil = await clienteRepo.save(
                clienteRepo.create({
                    nombre,
                    apellido,
                    telefono,
                    direccion,
                    id_usuario: usuarioGuardado.id_usuario,
                }),
            );
        } else {
            const trabajadorRepo = manager.getRepository('Trabajador');
            perfil = await trabajadorRepo.save(
                trabajadorRepo.create({
                    nombre,
                    apellido,
                    telefono,
                    id_usuario: usuarioGuardado.id_usuario,
                }),
            );
        }

        // el hash nunca se devuelve en la respuesta
        delete usuarioGuardado.contrasena;
        return { usuario: usuarioGuardado, perfil };
    });
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
    registroUnificado,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorCorreo,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
};
