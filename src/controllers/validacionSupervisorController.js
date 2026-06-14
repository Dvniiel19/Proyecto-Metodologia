const { sendSuccess, sendError } = require('../handlers/responseHandler');
const validacionSupervisorService = require('../services/validacionSupervisorService');
const { createValidacionSupervisorSchema, updateValidacionSupervisorSchema } = require('../validations/validacionSupervisorValidation');

/** post /validacion_supervisor
 * crear un nueva validacion de supervisor
 */
const crearValidacionSupervisor = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createValidacionSupervisorSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el contrato
        const validacionSupervisorCreado = await validacionSupervisorService.crearValidacionSupervisor(value);
        // respondemos con exito
        return sendSuccess(
            res,
            validacionSupervisorCreado,
            'Validacion de Supervisor creada con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el contrato', 500);
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
        // llamar al servicio obtenerValidacion_SupervisorPorId(id_validacion_Supervisor)
        const validacionSupervisor = await validacionSupervisorService.obtenerValidacionSupervisorPorId(id_validacion); 
        
        // si no existe retrona el error 404
        if (!validacionSupervisor) {
            return sendError(res, 'Validacion de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, validacionSupervisor, 'Validacion de Supervisor obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la validacion de Supervisor', 500);
    }
};

/** patch /validacion_supervisor/:id
 * actualizar validacion de supervisor
 */
const actualizarValidacionSupervisor = async (req, res) => {
    try {
        const validacion = updateValidacionSupervisorSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
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
            return sendError(res, 'Validacion de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'Validacion de Supervisor actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar validacion de Supervisor', 500);
    }
};

/** delete /validacion_supervisor/:id
 * eliminar validacion de supervisor
 */
const eliminarValidacionSupervisor = async (req, res) => {
    try {
        const { id_validacion} = req.params;
        // llamar al servicio eliminarValidacion_supervisor(id_validacion_supervisor)
        const eliminado = await validacionSupervisorService.eliminarValidacionSupervisor(id_validacion);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'Validacion de Supervisor no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'Validacion de Supervisor eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar validacion de Supervisor', 500);
    }
};

module.exports = {
    crearValidacionSupervisor,
    obtenerTodasLasValidacioneSupervisor,
    obtenerValidacionSupervisorPorId,
    actualizarValidacionSupervisor,
    eliminarValidacionSupervisor
};