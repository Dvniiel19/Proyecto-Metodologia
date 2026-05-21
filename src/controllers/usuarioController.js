const { sendSuccess, sendError } = require('../handlers/responseHandler');
const usuarioService = require('../services/usuarioService');
const { createUsuarioSchema, updateUsuarioSchema } = require('../validations/usuarioValidation');

/** post /usuario
 * crear un nuevo usuario
 */
const crearUsuario = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createUsuarioSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }

        // validamos la contraseña del usuario
        const contraseña = req.body.contraseña;
        
        if (!contraseña || contraseña.length < 8) {
            return sendError(res, 'La contraseña debe tener minimo 8 caracteres', 400);
        }
        if (!/[A-Z]/.test(contraseña)) {
            return sendError(res, 'La contraseña debe tener minimo una letra mayuscula', 400);
        }
        if (!/[a-z]/.test(contraseña)){
            return sendError(res, 'La contraseña debe tener minimo una letra minuscula', 400);
        }
        if (!/\d/.test(contraseña)) {
            return sendError(res, 'La contraseña debe tener minimo un numero', 400);
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(contraseña)) {
            return sendError(res, 'La contraseña debe tener minimo un caracter especial', 400);
        }

        const usuarioCreado = await usuarioService.crearUsuario(value);
        return sendSuccess(
            res,
            usuarioCreado,
            'Usuario creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el usuario', 500);
    }
};

/** get /usuario
 * obtiene todos los usuarios
 */
const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerTodosLosUsuarios();
        return sendSuccess(res, usuarios, 'Usuarios obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener usuarios', 500);
    }
};

/** get /usuario/:id
 * obtiene un usuario especifico por id
 */
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id_usuario);

        if (!usuario) {
            return sendError(res, 'Usuario no encontrado', 404);
        } else {
            return sendSuccess(res, usuario, 'Usuario obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el usuario', 500);
    }
};

/** patch /usuario/:id
 * actualizar usuario
 */
const actualizarUsuario = async (req, res) => {
    try {
        const validacion = updateUsuarioSchema.validate(req.body);
        
        // validamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        // validamos la contraseña 
        const contraseña = req.body.contraseña;
        
        if (contraseña) {
            if (contraseña.length < 8) {
                return sendError(res, 'La contraseña debe tener minimo 8 caracteres', 400);
            }
            if (!/[A-Z]/.test(contraseña)) {
                return sendError(res, 'La contraseña debe tener minimo una letra mayuscula', 400);
            }
            if (!/[a-z]/.test(contraseña)){
                return sendError(res, 'La contraseña debe tener minimo una letra minuscula', 400);
            }
            if (!/\d/.test(contraseña)) {
                return sendError(res, 'La contraseña debe tener minimo un numero', 400);
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(contraseña)) {
                return sendError(res, 'La contraseña debe tener minimo un caracter especial', 400);
            }
        }

        const obtenerid = req.params.id_usuario;
        const resultado = await usuarioService.actualizarUsuario(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Usuario no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'Usuario actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar usuario', 500);
    }
};

/** delete /usuario/:id
 * eliminar usuario
 */
const eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        // llamar al servicio eliminarUsuario(id_usuario)
        const eliminado = await usuarioService.eliminarUsuario(id_usuario);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'Usuario no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Usuario eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar un usuario', 500);
    }
};

module.exports = {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};