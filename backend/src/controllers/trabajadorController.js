const { sendSuccess, sendError } = require('../handlers/responseHandler');
const trabajadorService = require('../services/trabajadorService');
const { createTrabajadorSchema, updateTrabajadorSchema } = require('../validations/trabajadorValidation');

/** post /trabajador
 * crear un nuevo trabajador
 */
const crearTrabajador = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createTrabajadorSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const trabajadorCreado = await trabajadorService.crearTrabajador(value);
        return sendSuccess(
            res,
            trabajadorCreado,
            'Trabajador creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el trabajador', 500);
    }
};

/** get /trabajador
 * obtiene todos los trabajadores
 */
const obtenerTodosLosTrabajador = async (req, res) => {
    try {
        const trabajadores = await trabajadorService.obtenerTodosLosTrabajadores();
        return sendSuccess(res, trabajadores, 'Trabajadores obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener trabajadores', 500);
    }
};

/** get /trabajador/:id
 * obtiene un trabajador especifico por id
 */
const obtenerTrabajadorPorId = async (req, res) => {
    try {
        const { id_trabajador } = req.params;
        const trabajador = await trabajadorService.obtenerTrabajadorPorId(id_trabajador); 
        
        if (!trabajador) {
            return sendError(res, 'Trabajador no encontrado', 404);
        } else {
            return sendSuccess(res, trabajador, 'Trabajador obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el trabajador', 500);
    }
};

/** patch /trabajador/:id
 * actualizar trabajador
 */
const actualizarTrabajador = async (req, res) => {
    try {
        const validacion = updateTrabajadorSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_trabajador;
        const resultado = await trabajadorService.actualizarTrabajador(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Trabajador no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'Trabajador actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar trabajador', 500);
    }
};

/** delete /trabajador/:id
 * eliminar trabajador
 */
const eliminarTrabajador = async (req, res) => {
    try {
        const { id_trabajador } = req.params;

        const eliminado = await trabajadorService.eliminarTrabajador(id_trabajador);

        if (!eliminado) {
            return sendError(res, 'Trabajador no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Trabajador eliminado correctamente');
        }

    } catch (error) {
        console.error('Error crítico al eliminar trabajador:', error.message);
        
        if (error.message.includes('foreign key') || error.message.includes('violates') || error.message.includes('constraint')) {
            return sendError(
                res, 
                'No se puede eliminar este trabajador porque cuenta con servicios asignados, tareas activas o registros de asistencia en el sistema.', 
                400
            );
        }

        return sendError(res, 'No se pudo completar la eliminación del trabajador debido a restricciones del sistema.', 400);
    }
};

module.exports = {
    crearTrabajador,
    obtenerTodosLosTrabajador,
    obtenerTrabajadorPorId,
    actualizarTrabajador,
    eliminarTrabajador
};