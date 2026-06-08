const { sendSuccess, sendError } = require('../handlers/responseHandler');
const establecimientoService = require('../services/establecimientoService');
const { createEstablecimientoSchema, updateEstablecimientoSchema } = require('../validations/establecimientoValidation');

/** post /establecimiento
 * crear un nuevo establecimiento
 */
const crearEstablecimiento = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createEstablecimientoSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el establecimiento
        const establecimientoCreado = await establecimientoService.crearEstablecimiento(value);
        // respondemos con exito
        return sendSuccess(
            res,
            establecimientoCreado,
            'establecimiento creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el establecimiento', 500);
    }
};

/** get /establecimiento
 * obtiene todos los establecimientos
 */
const obtenerTodosLosEstablecimiento = async (req, res) => {
    try {
        const establecimiento = await establecimientoService.obtenerTodosLosEstablecimientos();
        return sendSuccess(res, establecimiento, 'establecimiento obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener establecimiento', 500);
    }
};

/** get /establecimiento/:id
 * obtiene un establecimiento especifico por id
 */
const obtenerEstablecimientoPorId = async (req, res) => {
    try {
        const { id_establecimiento } = req.params;
        // llamar al servicio obtenerestablecimientoPorId(id_establecimiento)
        const establecimiento = await establecimientoService.obtenerEstablecimientoPorId(id_establecimiento); 
        
        // si no existe retrona el error 404
        if (!establecimiento) {
            return sendError(res, 'establecimiento no encontrado', 404);
        } else {
            return sendSuccess(res, establecimiento, 'establecimiento obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el establecimiento', 500);
    }
};

/** patch /establecimiento/:id
 * actualizar establecimiento
 */
const actualizarEstablecimiento = async (req, res) => {
    try {
        const validacion = updateEstablecimientoSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_establecimiento;
        const resultado = await establecimientoService.actualizarEstablecimiento(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'establecimiento no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'establecimiento actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar establecimiento', 500);
    }
};

/** delete /establecimiento/:id
 * eliminar establecimiento
 */
const eliminarEstablecimiento = async (req, res) => {
    try {
        const { id_establecimiento } = req.params;
        // llamar al servicio eliminarestablecimiento(id_establecimiento)
        const eliminado = await establecimientoService.eliminarEstablecimiento(id_establecimiento);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'establecimiento no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'establecimiento eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar establecimiento', 500);
    }
};

module.exports = {
    crearEstablecimiento,
    obtenerTodosLosEstablecimiento,
    obtenerEstablecimientoPorId,
    actualizarEstablecimiento,
    eliminarEstablecimiento
};