const { sendSuccess, sendError } = require('../handlers/responseHandler');
const asignarServicioService = require('../services/asignarServicioService');
const { createAsignarServicioSchema, updateAsignarServicioSchema } = require('../validations/asignarServicioValidation');

/** post /asignarServicio
 * crear un nuevo asignarServicio
 */
const crearAsignacion = async (req, res) => {
    try {
        // validamos los datos de entrada con joi usando el nombre correcto
        const { error, value } = createAsignarServicioSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const asignarServicioCreado = await asignarServicioService.crearAsignacion(value);
        
        return sendSuccess(
            res,
            asignarServicioCreado,
            'Asignación de servicio creada con exito',
            201
        );
    } catch (error) {
        console.error(error);
        if (error.statusCode) {
            return sendError(res, error.message, error.statusCode);
        }
        return sendError(res, 'Error al crear la asignación de servicio', 500);
    }
};

/** get /asignarServicio
 * obtiene todas las asignaciones
 */
const obtenerTodasLasAsignaciones = async (req, res) => {
    try {
        const asignarServicio = await asignarServicioService.obtenerTodasLasAsignaciones();
        return sendSuccess(res, asignarServicio, 'Asignaciones obtenidas exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener las asignaciones', 500);
    }
};

/** get /asignarServicio/:id
 * obtiene una asignacion especifica por id
 */
const obtenerAsignacionPorId = async (req, res) => {
    try {
        const { id_asignacion } = req.params;
        const asignarServicio = await asignarServicioService.obtenerAsignacionPorId(id_asignacion); 
        
        if (!asignarServicio) {
            return sendError(res, 'Asignación no encontrada', 404);
        } else {
            return sendSuccess(res, asignarServicio, 'Asignación obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la asignación', 500);
    }
};

/** patch /asignarServicio/:id
 * actualizar asignacion
 */
const actualizarAsignacion= async (req, res) => {
    try {
        const validacion = updateAsignarServicioSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_asignacion;
        const resultado = await asignarServicioService.actualizarAsignacion(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Asignación no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'Asignación actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar asignación', 500);
    }
};

/** delete /asignarServicio/:id
 * eliminar asignacion
 */
const eliminarAsignacion = async (req, res) => {
    try {
        const { id_asignacion } = req.params;
        const eliminado = await asignarServicioService.eliminarAsignacion(id_asignacion);

        if (!eliminado) {
            return sendError(res, 'Asignación no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'Asignación eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar asignación', 500);
    }
};

module.exports = {
    crearAsignacion,
    obtenerAsignacionPorId,
    obtenerTodasLasAsignaciones,
    actualizarAsignacion,
    eliminarAsignacion
};