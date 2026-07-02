const { sendSuccess, sendError } = require('../handlers/responseHandler');
const rolService = require('../services/rolService');
const { createRolSchema, updateRolSchema } = require('../validations/rolValidation');

/** post /rol
 * crear un nuevo rol
 */
const crearRol = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createRolSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el rol
        const rolCreado = await rolService.crearRol(value);
        // respondemos con exito
        return sendSuccess(
            res,
            rolCreado,
            'Rol creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el rol', 500);
    }
};

/** get /rol
 * obtiene todos los roles
 */
const obtenerTodosLosRol = async (req, res) => {
    try {
        const roles = await rolService.obtenerTodosLosRoles();
        return sendSuccess(res, roles, 'Roles obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener roles', 500);
    }
};

/** get /rol/:id
 * obtiene un rol especifico por id
 */
const obtenerRolPorId = async (req, res) => {
    try {
        const { id_rol } = req.params;
        // llamar al servicio obtenerRolPorId(id_rol)
        const rol = await rolService.obtenerRolPorId(id_rol); 
        
        // si no existe retrona el error 404
        if (!rol) {
            return sendError(res, 'Rol no encontrado', 404);
        } else {
            return sendSuccess(res, rol, 'Rol obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el rol', 500);
    }
};

/** patch /rol/:id
 * actualizar rol
 */
const actualizarRol = async (req, res) => {
    try {
        const validacion = updateRolSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_rol;
        const resultado = await rolService.actualizarRol(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Rol no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'Rol actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar rol', 500);
    }
};

/** delete /rol/:id
 * eliminar rol
 */
const eliminarRol = async (req, res) => {
    try {
        const { id_rol } = req.params;
        // llamar al servicio eliminarRol(id_rol)
        const eliminado = await rolService.eliminarRol(id_rol);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'Rol no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Rol eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar rol', 500);
    }
};

module.exports = {
    crearRol,
    obtenerTodosLosRol,
    obtenerRolPorId,
    actualizarRol,
    eliminarRol
};