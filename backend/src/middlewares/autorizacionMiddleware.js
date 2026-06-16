/**
 * Middleware de Autorizacion
 * Verifica si el usuario autenticado tiene los roles permitidos para acceder a una ruta
 * Si el usuario no tiene los permisos, retorna un error 403
 */

const { sendError } = require('../handlers/responseHandler');

/**
 * Verifica que el usuario tenga uno de los roles permitidos
 * @param {array} rolesPermitidos Arreglo de roles que tienen acceso a la ruta
 * @returns {function} Funcion middleware
 */
const autorizacion = (rolesPermitidos = []) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario este autenticado (que exista req.user)
            if (!req.user) {
                return sendError(res, 'Usuario no autenticado', 401);
            }

            // Obtener el rol del usuario autenticado
            const rolUsuario = req.user.nombre_rol;

            // Verificar que el rol del usuario este en la lista de roles permitidos
            if (!rolesPermitidos.includes(rolUsuario)) {
                return sendError(
                    res,
                    'No tienes permisos para acceder. Roles requeridos: ' + rolesPermitidos.join(', '),
                    403
                );
            }

            // El usuario tiene permiso continuar con la siguiente funcion
            next();
        } catch (error) {
            console.error('Error en middleware de autorizacion:', error.message);
            return sendError(res, 'Error en la autorizacion', 500);
        }
    };
};

module.exports = {
    autorizacion
};
