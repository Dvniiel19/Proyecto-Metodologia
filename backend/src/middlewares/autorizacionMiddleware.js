const db = require('../config/db');
const { sendError } = require('../handlers/responseHandler');

/**
 * Middleware Global: Verifica si el rol ha expirado en tiempo real (Peticiones generales)
 */
const verificarEstadoRol = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id_usuario) {
            return next();
        }

        const usuarioRepo = db.getRepository('Usuario'); 
        const usuarioBD = await usuarioRepo.findOne({ where: { id_usuario: req.user.id_usuario } });

        if (!usuarioBD) {
            return sendError(res, 'Usuario no encontrado en el sistema', 404);
        }

        const fechaActual = new Date();
        const fechaExpiracion = usuarioBD.fecha_expiracion ? new Date(usuarioBD.fecha_expiracion) : null;

        if (fechaExpiracion && fechaActual > fechaExpiracion) {
            if (usuarioBD.estado_rol !== 'Rol expirado') {
                usuarioBD.estado_rol = 'Rol expirado';
                await usuarioRepo.save(usuarioBD);
            }
            return sendError(res, 'Tu rol ha expirado. Acceso revocado.', 403);
        }

        if (usuarioBD.estado_rol === 'Rol expirado') {
            return sendError(res, 'Tu sesión ha sido bloqueada porque tu rol expiró.', 403);
        }

        req.user.estado_rol = usuarioBD.estado_rol;
        next();
    } catch (error) {
        console.error('Error en verificarEstadoRol:', error.message);
        next();
    }
};

/**
 * Middleware específico por ruta (RBAC): BLINDAJE ABSOLUTO CONTRA ROLES EXPIRADOS
 */
const autorizacion = (rolesPermitidos = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id_usuario) {
                return sendError(res, 'Usuario no autenticado', 401);
            }

            // 1. ANTES DE MIRAR LOS PERMISOS, VALIDAMOS LA BD REAL
            const usuarioRepo = db.getRepository('Usuario');
            const usuarioBD = await usuarioRepo.findOne({ where: { id_usuario: req.user.id_usuario } });

            if (!usuarioBD) {
                return sendError(res, 'Usuario inválido', 401);
            }
            // 2. VALIDAMOS SI EL ROL ESTÁ EXPIRADO
            const fechaActual = new Date();
            const fechaExpiracion = usuarioBD.fecha_expiracion ? new Date(usuarioBD.fecha_expiracion) : null;

        
            if ((fechaExpiracion && fechaActual > fechaExpiracion) || usuarioBD.estado_rol === 'Rol expirado') {
                if (usuarioBD.estado_rol !== 'Rol expirado') {
                    usuarioBD.estado_rol = 'Rol expirado';
                    await usuarioRepo.save(usuarioBD);
                }
                return sendError(res, 'Operación denegada. Tu rol se encuentra expirado.', 403);
            }

            // 3. CONTINÚA CON LA VALIDACIÓN NORMAL DE ROLES
            const rolUsuario = req.user.nombre_rol;
            if (!rolesPermitidos.includes(rolUsuario)) {
                return sendError(
                    res,
                    'No tienes permisos para acceder. Roles requeridos: ' + rolesPermitidos.join(', '),
                    403
                );
            }

            next();
        } catch (error) {
            console.error('Error en middleware de autorizacion:', error.message);
            return sendError(res, 'Error en la autorizacion', 500);
        }
    };
};

module.exports = {
    autorizacion,
    verificarEstadoRol
};