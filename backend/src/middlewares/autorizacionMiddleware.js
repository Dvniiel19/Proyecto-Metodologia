const db = require('../config/db');
const { sendError } = require('../handlers/responseHandler');

/**
 * Middleware Global: Verifica si el rol ha expirado usando SQL Directo
 */
const verificarEstadoRol = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id_usuario) {
            return next();
        }

        // Consulta nativa para evitar líos de nombres de entidades en TypeORM
        const resultado = await db.query(
            'SELECT estado_rol, fecha_expiracion FROM usuarios WHERE id_usuario = $1 LIMIT 1',
            [req.user.id_usuario]
        );

        const usuarioBD = resultado[0];

        if (!usuarioBD) {
            return sendError(res, 'Usuario no encontrado en el sistema', 404);
        }

        const fechaActual = new Date();
        const fechaExpiracion = usuarioBD.fecha_expiracion ? new Date(usuarioBD.fecha_expiracion) : null;

        if (fechaExpiracion && fechaActual > fechaExpiracion) {
            if (usuarioBD.estado_rol !== 'Rol expirado') {
                await db.query('UPDATE usuarios SET estado_rol = $1 WHERE id_usuario = $2', ['Rol expirado', req.user.id_usuario]);
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
        next(); // En caso de cualquier error imprevisto, dejamos pasar para no congelar la app
    }
};

/**
 * Middleware por ruta (RBAC): Validación activa y bypass seguro para eliminaciones
 */
const autorizacion = (rolesPermitidos = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id_usuario) {
                return sendError(res, 'Usuario no autenticado', 401);
            }

            // BYPASS DE SEGURIDAD: Si la petición es para eliminar un usuario, 
            // confiamos en el token del Administrador/Supervisor y saltamos la verificación interna para evitar bloqueos
            if (req.method === 'DELETE') {
                const rolUsuario = req.user.nombre_rol;
                if (!rolesPermitidos.includes(rolUsuario)) {
                    return sendError(res, 'No tienes permisos para eliminar.', 403);
                }
                return next();
            }

            // Para las demás peticiones (POST, PATCH, GET), validamos activamente contra la BD
            const resultado = await db.query(
                'SELECT estado_rol, fecha_expiracion FROM usuarios WHERE id_usuario = $1 LIMIT 1',
                [req.user.id_usuario]
            );
            
            const usuarioBD = resultado[0];

            if (usuarioBD) {
                const fechaActual = new Date();
                const fechaExpiracion = usuarioBD.fecha_expiracion ? new Date(usuarioBD.fecha_expiracion) : null;

                if ((fechaExpiracion && fechaActual > fechaExpiracion) || usuarioBD.estado_rol === 'Rol expirado') {
                    return sendError(res, 'Operación denegada. Tu rol se encuentra expirado.', 403);
                }
            }

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