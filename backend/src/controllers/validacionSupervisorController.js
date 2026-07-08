const { sendSuccess, sendError } = require('../handlers/responseHandler');
const validacionSupervisorService = require('../services/validacionSupervisorService');
const { createValidacionSupervisorSchema, updateValidacionSupervisorSchema } = require('../validations/validacionSupervisorValidation');

/** post /validacion_supervisor
 * crear un nueva validacion de supervisor
 */
const crearValidacionSupervisor = async (req, res) => {
    try {
        const { error, value } = createValidacionSupervisorSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const validacionSupervisorCreado = await validacionSupervisorService.crearValidacionSupervisor(value);
        return sendSuccess(
            res,
            validacionSupervisorCreado,
            'Validación de Supervisor creada con éxito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al procesar el registro de la validación.', 500);
    }
};

/** get /validacion_supervisor
 * obtiene todos las validaciones de supervisor
 */
const obtenerTodasLasValidacioneSupervisor = async (req, res) => {
    try {
        const validacionSupervisor = await validacionSupervisorService.obtenerTodasLasValidacioneSupervisor();
        return sendSuccess(res, validacionSupervisor, 'Validaciones de Supervisor obtenidas exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener validaciones de Supervisor', 500);
    }
};

/** get /validacion_supervisor/:id
 * obtiene una validacion de Supervisor especifica por id
 */
const obtenerValidacionSupervisorPorId = async (req, res) => {
    try {
        const { id_validacion } = req.params;
        const validacionSupervisor = await validacionSupervisorService.obtenerValidacionSupervisorPorId(id_validacion); 
        
        if (!validacionSupervisor) {
            return sendError(res, 'Validación de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, validacionSupervisor, 'Validación de Supervisor obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la validación de Supervisor', 500);
    }
};

/** patch /validacion_supervisor/:id
 * actualizar validacion de supervisor
 */
const actualizarValidacionSupervisor = async (req, res) => {
    try {
        const validacion = updateValidacionSupervisorSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_validacion;
        const resultado = await validacionSupervisorService.actualizarValidacionSupervisor(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Validación de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'Validación de Supervisor actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar la validación de Supervisor', 500);
    }
};

/** delete /validacion_supervisor/:id
 * eliminar validacion de supervisor
 */
const eliminarValidacionSupervisor = async (req, res) => {
    try {
        const { id_validacion } = req.params;
        const eliminado = await validacionSupervisorService.eliminarValidacionSupervisor(id_validacion);
        
        if (!eliminado) {
            return sendError(res, 'Validación de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'Validación de Supervisor eliminada correctamente');
        }
    } catch (error) {
        console.error('Error crítico al eliminar validación:', error.message);
      
        if (error.message.includes('foreign key') || error.message.includes('violates') || error.message.includes('constraint')) {
            return sendError(
                res, 
                'No se puede eliminar esta validación porque está vinculada a un historial operativo o asignación del sistema.', 
                400
            );
        }
        return sendError(res, 'No se pudo completar la eliminación de la validación debido a restricciones del registro.', 400);
    }
};

module.exports = {
    crearValidacionSupervisor,
    obtenerTodasLasValidacioneSupervisor,
    obtenerValidacionSupervisorPorId,
    actualizarValidacionSupervisor,
    eliminarValidacionSupervisor
};