const { sendSuccess, sendError } = require('../handlers/responseHandler');
const usuarioService = require('../services/usuarioService');
const rolService = require('../services/rolService');
const { createUsuarioSchema, updateUsuarioSchema } = require('../validations/usuarioValidation');
const {encrypt, compare} = require('../utils/bcryptUtils');
const { generarToken } = require('../auth/jwt.strategy');

// [MODIFICADO] Funcion extraida para evitar duplicar la validacion entre crearUsuario y actualizarUsuario.
// Retorna un string con el mensaje de error si no cumple los requisitos, o null si es valida.
const validarContrasena = (contrasena) => {
    if (!contrasena || contrasena.length < 8) return 'La contraseña debe tener minimo 8 caracteres';
    if (!/[A-Z]/.test(contrasena)) return 'La contraseña debe tener minimo una letra mayuscula';
    if (!/[a-z]/.test(contrasena)) return 'La contraseña debe tener minimo una letra minuscula';
    if (!/\d/.test(contrasena)) return 'La contraseña debe tener minimo un numero';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) return 'La contraseña debe tener minimo un caracter especial';
    return null;
};

/** post /auth/login
 * autenticar usuario y generar token JWT
 */
const login = async (req, res) => {
    try {
        // obtener correo y contraseña desde el body
        const { correo, contrasena } = req.body;

        // validar que los campos esten presentes
        if (!correo || !contrasena) {
            return sendError(res, 'Correo y contrasena son requeridos', 400);
        }

        // buscar al usuario por correo en la base de datos
        const usuario = await usuarioService.obtenerUsuarioPorCorreo(correo);

        // verificar que el usuario exista
        if (!usuario) {
            return sendError(res, 'Correo o contraseña incorrectos', 401);
        }

        // comparar la contrasena proporcionada con la almacenada (hasheada)
        const contrasenaValida = await compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return sendError(res, 'Correo o contraseña incorrectos', 401);
        }

        // obtener el nombre del rol para incluirlo en el token
        const rol = await rolService.obtenerRolPorId(usuario.id_rol);
        const nombreRol = rol ? rol.nombre_rol : null; // Si no encuentra nada devuelve null

        // generar token JWT con id_usuario, id_rol y nombre_rol
        const token = generarToken(usuario.id_usuario, usuario.id_rol, nombreRol);

        // retornar el token y datos basicos del usuario
        return sendSuccess(
            res,
            {
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    correo: usuario.correo,
                    id_rol: usuario.id_rol
                }
            },
            'Sesion iniciada exitosamente',
            200
        );
    } catch (error) {
        console.error('Error en login:', error);
        return sendError(res, 'Error al iniciar sesion', 500);
    }
};

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

        // [MODIFICADO] Usa validarContrasena() en lugar de repetir las mismas condiciones aqui
        const errorContrasena = validarContrasena(req.body.contrasena);
        if (errorContrasena) {
            return sendError(res, errorContrasena, 400);
        }

        value.contrasena = await encrypt(value.contrasena);
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

        // [MODIFICADO] Solo valida y encripta la contraseña si el campo viene en el body (PATCH puede omitirla)
        if (req.body.contrasena) {
            const errorContrasena = validarContrasena(req.body.contrasena);
            if (errorContrasena) {
                return sendError(res, errorContrasena, 400);
            }
            validacion.value.contrasena = await encrypt(validacion.value.contrasena);
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
    login,
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};