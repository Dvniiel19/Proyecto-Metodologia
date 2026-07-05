const { sendSuccess, sendError } = require('../handlers/responseHandler');
const usuarioService = require('../services/usuarioService');
const rolService = require('../services/rolService');
const { createUsuarioSchema, updateUsuarioSchema, registerSchema } = require('../validations/usuarioValidation');
const {encrypt, compare} = require('../utils/bcryptUtils');
const { generarToken } = require('../auth/jwt.strategy');


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

// [AGREGADO] Roles que pueden auto-registrarse desde el formulario publico.
// Solo Cliente: las cuentas de trabajadores y roles administrativos las crea
// un Administrador desde la gestion de usuarios, nunca por registro abierto.
const ROLES_REGISTRABLES = ['Cliente'];

/** post /auth/register
 * registro unificado: crea cuenta (Usuario) + perfil (Cliente o Trabajador)
 * en una unica transaccion de base de datos
 */
const registro = async (req, res) => {
    try {
        // 1. Resolver el rol ANTES de validar: la validacion condicional de Joi
        // (direccion obligatoria solo para clientes) depende del nombre del rol,
        // y los IDs pueden variar entre bases de datos
        const idRol = Number(req.body?.id_rol);
        if (!Number.isInteger(idRol) || idRol <= 0) {
            return sendError(res, 'Error de validacion de datos', 400, ['El rol es un campo obligatorio']);
        }

        const rol = await rolService.obtenerRolPorId(idRol);
        if (!rol) {
            return sendError(res, 'El rol seleccionado no existe', 400);
        }
        if (!ROLES_REGISTRABLES.includes(rol.nombre_rol)) {
            return sendError(res, `Solo puedes registrarte como: ${ROLES_REGISTRABLES.join(' o ')}`, 403);
        }

        // 2. Validar el payload combinado con el contexto del rol resuelto
        const { error, value } = registerSchema.validate(req.body, {
            context: { esCliente: rol.nombre_rol === 'Cliente' },
        });
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }

        // 3. Correo duplicado se responde como conflicto y no como error generico
        const existente = await usuarioService.obtenerUsuarioPorCorreo(value.correo);
        if (existente) {
            return sendError(res, 'Ya existe una cuenta con ese correo', 409);
        }

        // 4. Hashear la contrasena y ejecutar la transaccion (usuario + perfil)
        value.contrasena = await encrypt(value.contrasena);
        const resultado = await usuarioService.registroUnificado(value, rol.nombre_rol);

        return sendSuccess(res, resultado, 'Registro completado con exito', 201);
    } catch (error) {
        console.error('Error en registro:', error);
        return sendError(res, 'Error al completar el registro', 500);
    }
};

// [AGREGADO] Roles de personal que se crean desde la administracion.
// Reutiliza la misma transaccion del registro publico (usuario + perfil Trabajador).
const ROLES_PERSONAL = ['Trabajador', 'Supervisor', 'Coordinador', 'GestorInventario'];

/** post /usuario/personal
 * crear una cuenta de personal (Usuario + perfil Trabajador) en una transaccion.
 * Admin puede crear cualquier rol de personal; Coordinador solo Trabajadores.
 */
const crearPersonal = async (req, res) => {
    try {
        // 1. Resolver y validar el rol destino
        const idRol = Number(req.body?.id_rol);
        if (!Number.isInteger(idRol) || idRol <= 0) {
            return sendError(res, 'Error de validacion de datos', 400, ['El rol es un campo obligatorio']);
        }

        const rol = await rolService.obtenerRolPorId(idRol);
        if (!rol) {
            return sendError(res, 'El rol seleccionado no existe', 400);
        }
        if (!ROLES_PERSONAL.includes(rol.nombre_rol)) {
            return sendError(res, `Solo puedes crear personal con rol: ${ROLES_PERSONAL.join(', ')}`, 400);
        }

        // 2. El Coordinador solo puede crear cuentas de Trabajador
        if (req.user.nombre_rol === 'Coordinador' && rol.nombre_rol !== 'Trabajador') {
            return sendError(res, 'Un Coordinador solo puede crear cuentas de Trabajador', 403);
        }

        // 3. Validar el payload combinado (la direccion no aplica para personal)
        const { error, value } = registerSchema.validate(req.body, {
            context: { esCliente: false },
        });
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }

        // 4. Correo duplicado → conflicto
        const existente = await usuarioService.obtenerUsuarioPorCorreo(value.correo);
        if (existente) {
            return sendError(res, 'Ya existe una cuenta con ese correo', 409);
        }

        // 5. Hashear y ejecutar la misma transaccion del registro unificado
        value.contrasena = await encrypt(value.contrasena);
        const resultado = await usuarioService.registroUnificado(value, rol.nombre_rol);

        return sendSuccess(res, resultado, 'Personal creado con exito', 201);
    } catch (error) {
        console.error('Error al crear personal:', error);
        return sendError(res, 'Error al crear el personal', 500);
    }
};

/** get /auth/roles-registrables
 * devuelve los roles disponibles para el registro publico (sin autenticacion),
 * para que el formulario de registro no tenga que hardcodear IDs de rol
 */
const rolesRegistrables = async (req, res) => {
    try {
        const roles = await rolService.obtenerTodosLosRoles();
        const registrables = roles.filter(r => ROLES_REGISTRABLES.includes(r.nombre_rol));
        return sendSuccess(res, registrables, 'Roles registrables obtenidos exitosamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener los roles', 500);
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
        // [AGREGADO] Solo el propio usuario o un Administrador pueden modificar la cuenta
        // (permite el "cambiar mi contraseña" del perfil sin abrir un hueco de seguridad)
        const esPropio = Number(req.params.id_usuario) === req.user.id_usuario;
        if (!esPropio && req.user.nombre_rol !== 'Administrador') {
            return sendError(res, 'Solo puedes modificar tu propia cuenta', 403);
        }

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
        //se se actualiza la contrasena se encripta antes de guardarla
        if (req.body.contrasena) {
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
    registro,
    rolesRegistrables,
    crearPersonal,
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};