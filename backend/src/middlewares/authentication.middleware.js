/**
 * Middleware de Autenticacion
 * Verifica el token JWT en el header Authorization
 * Extrae la informacion del usuario y la almacena en req.user
 * Si el token es invalido o no existe retorna un error 401
 */

const { sendError } = require('../handlers/responseHandler');
const { verificarToken } = require('../auth/jwt.strategy');


const autenticacion = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization de la solicitud
        const authHeader = req.headers['authorization'];

        // Si no viene el header, rechazar la solicitud
        if (!authHeader) {
            return sendError(
                res,
                'Token de autenticacion no proporcionado. Use header: Authorization: Bearer <token>',
                401
            );
        }

        // Verificar que el header tenga el formato correcto "Bearer <token>"
        if (!authHeader.startsWith('Bearer ')) {
            return sendError(
                res,
                'Formato de autenticacion invalido. Use: Authorization: Bearer <token>',
                401
            );
        }

        const token = authHeader.slice(7);

        // Verificar que el token sea valido y no haya expirado
        const decoded = verificarToken(token);

        req.user = {
            id_usuario: decoded.id_usuario,
            id_rol: decoded.id_rol,
            nombre_rol: decoded.nombre_rol,
            estado_rol: decoded.estado_rol,
            iat: decoded.iat,
            exp: decoded.exp,
        };

        // Verificar si el rol del usuario ha expirado
        if (decoded.estado_rol === 'Rol expirado') {
            return sendError(
                res,
                'Tu rol ha caducado. Contacta al administrador para renovarlo.',
                403
            );
        }

        // El usuario esta autenticado, continuar con la siguiente funcion
        next();
    } catch (error) {
        console.error('Error en middleware de autenticacion:', error.message);

        // Diferenciar el tipo de error para dar un mensaje mas especifico
        if (error.message.includes('expirado')) {
            return sendError(res, 'Token expirado. Por favor vuelva a iniciar sesion', 401);
        } else if (error.message.includes('invalido')) {
            return sendError(res, 'Token invalido o malformado', 401);
        } else {
            return sendError(res, 'Error en la autenticacion', 401);
        }
    }
};
module.exports = {
    autenticacion,
};