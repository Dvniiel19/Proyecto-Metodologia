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

/** put /tarea/:id_tarea/finalizar
 * finalizar una tarea con evidencia obligatoria
 */
const finalizarTarea = async (req, res) => {
    try {
        // El middleware validarIdParam del router ya garantiza que id_tarea sea un entero positivo
        const { id_tarea } = req.params;

        if (!req.file) {
            return sendError(res, 'La foto de evidencia es obligatoria para finalizar la tarea', 400);
        }

        const resultado = await tareaService.finalizarTareaConEvidencia(Number(id_tarea), req.file);
        if (!resultado) {
            return sendError(res, 'tarea no encontrada', 404);
        }

        return sendSuccess(
            res,
            resultado,
            'Tarea finalizada correctamente y enviada a validación',
            200
        );
    } catch (error) {
        if (error.statusCode) {
            return sendError(res, error.message, error.statusCode);
        }
        console.error(error);
        return sendError(res, 'Error al finalizar la tarea', 500, [error.message]);
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

/** get /tarea/mis-tareas
 * obtiene las tareas del trabajador autenticado, agrupadas por servicio
 */
const obtenerMisTareas = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const resultado = await tareaService.obtenerMisTareas(id_usuario);
        return sendSuccess(res, resultado, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener tus tareas', 500);
    }
};

/** get /tarea/:id
 * obtiene una tarea especifico por id
 */
const obtenerTareaPorId = async (req, res) => {
    try {
        const { id_tarea } = req.params;
        const tarea = await tareaService.obtenerTareaPorId(id_tarea); 
        
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
        const eliminado = await tareaService.eliminarTarea(id_tarea);
        
        if (!eliminado) {
            return sendError(res, 'tarea no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'tarea eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar tarea', 500);
    }
};

/** get /tarea/pendientes-cliente
 * obtiene las tareas pendientes de validación del cliente autenticado
 */
const obtenerTareasPendientesCliente = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario;
        const resultado = await tareaService.obtenerTareasPendientesCliente(id_usuario);
        return sendSuccess(res, resultado, 'Tareas pendientes obtenidas correctamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener tareas pendientes', 500);
    }
};

/** put /tarea/:id_tarea/validar-cliente
 * el cliente aprueba o rechaza una tarea finalizada por el trabajador
 */
const validarTareaCliente = async (req, res) => {
    try {
        const { id_tarea } = req.params;
        const { accion } = req.body;
        const id_usuario = req.user.id_usuario;

        if (!accion || !['aprobado', 'rechazado'].includes(accion)) {
            return sendError(res, 'Debe enviar una acción válida: "aprobado" o "rechazado"', 400);
        }

        const resultado = await tareaService.validarTareaCliente(Number(id_tarea), id_usuario, accion);
        if (!resultado) {
            return sendError(res, 'Tarea no encontrada', 404);
        }

        return sendSuccess(
            res,
            resultado,
            accion === 'aprobado' ? 'Tarea aprobada correctamente' : 'Tarea rechazada correctamente',
            200,
        );
    } catch (error) {
        if (error.statusCode) {
            return sendError(res, error.message, error.statusCode);
        }
        console.error(error);
        return sendError(res, 'Error al validar la tarea', 500, [error.message]);
    }
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea,
    finalizarTarea,
    obtenerMisTareas,
    obtenerTareasPendientesCliente,
    validarTareaCliente,
};