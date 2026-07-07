/**
 * Estrategia JWT
 * Maneja la generacion, verificacion y decodificacion de tokens JWT
 * Utiliza jsonwebtoken y variables de entorno para las claves secretas
 */

const jwt = require('jsonwebtoken');

// Obtener las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET no esta en .env');
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

/**
 * Genera un token JWT con la informacion del usuario
 * @param {number} id_usuario
 * @param {number} id_rol
 * @param {string} nombre_rol 
 * @param {string} estado_rol
 * @returns {string} Token JWT firmado
 */
const generarToken = (id_usuario, id_rol, nombre_rol, estado_rol) => {
    try {
        const payload = {
            id_usuario,
            id_rol,
            nombre_rol,
            estado_rol,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
            algorithm: 'HS256'
        });

        return token;
    } catch (error) {
        console.error('Error al generar token JWT:', error);
        throw new Error('No se pudo generar el token de autenticacion');
    }
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token Token JWT a verificar
 * @returns {object}Payload decodificado  (id_usuario, id_rol, nombre_rol, iat(cuando se creo), exp(cuando expira))
 * @throws {Error} Si el token es invalido o ha expirado
 */
const verificarToken = (token) => {
    try {
        const tokenSinBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        // Verificar que el token sea valido, no haya expirado y este "firmado" con HS256 por seguridad
        const decoded = jwt.verify(tokenSinBearer, JWT_SECRET, {
            algorithms: ['HS256']
        });

        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('El token expiro');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Token invalido o malformado');
        } else {
            throw new Error('Error al verificar el token');
        }
    }
};


module.exports = {
    generarToken,
    verificarToken
};
