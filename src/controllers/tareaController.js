const { sendSuccess, sendError } = require('../handlers/responseHandler');
const tareaService = require('../services/tareaService');
const { createTareaSchema, updateTareaSchema } = require('../validations/tareaValidation');

/** post /tarea
 * crear un nuevo tarea
 */
const crearTarea = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createTareaSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear la tarea
        const tareaCreado = await tareaService.crearTarea(value);
        // respondemos con exito
        return sendSuccess(
            res,
            tareaCreado,
            'tarea creada con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al la tarea', 500);
    }
};

/** get /tarea
 * obtiene todos los tareas
 */
const obtenerTodasLasTarea = async (req, res) => {
    try {
        const tarea = await tareaService.obtenerTodasLasTarea();
        return sendSuccess(res, tarea, 'tareas obtenidas exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener tarea', 500);
    }
};

/** get /tarea/:id
 * obtiene una tarea especifico por id
 */
const obtenerTareaPorId = async (req, res) => {
    try {
        const { id_tarea } = req.params;
        // llamar al servicio obtenertareaPorId(id_tarea)
        const tarea = await tareaService.obtenerTareaPorId(id_tarea); 
        
        // si no existe retrona el error 404
        if (!tarea) {
            return sendError(res, 'tarea no encontrada', 404);
        } else {
            return sendSuccess(res, tarea, 'tarea obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la tarea', 500);
    }
};

/** patch /tarea/:id
 * actualizar tarea
 */
const actualizarTarea = async (req, res) => {
    try {
        const validacion = updateTareaSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_tarea;
        const resultado = await tareaService.actualizarTarea(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'tarea no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'tarea actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar tarea', 500);
    }
};

/** delete /tarea/:id
 * eliminar tarea
 */
const eliminarTarea = async (req, res) => {
    try {
        const { id_tarea } = req.params;
        // llamar al servicio eliminarTarea(id_tarea)
        const eliminado = await tareaService.eliminarTarea(id_tarea);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'tarea no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'tarea eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar tarea', 500);
    }
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea
};