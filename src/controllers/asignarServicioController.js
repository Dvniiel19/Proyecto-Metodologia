const { sendSuccess, sendError } = require('../handlers/responseHandler');
const asignarServicioService = require('../services/asignarServicioService');
const { createAsignarServicioSchema, updateAsignarServicioSchema } = require('../validations/asignarServicioValidation');

/** post /asignarServicio
 * crear un nuevo asignarServicio
 */
const createAsignarServicio = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createAsignarServicioSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el cliente
        const asignarServicioCreado = await asignarservicioService.crearAsignarServicio(value);
        // respondemos con exito
        return sendSuccess(
            res,
            asignarServicioCreado   ,
            'asignarServicio creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el asignarServicio', 500);
    }
};

/** get /cliente
 * obtiene todos los clientes
 */
const obtenerTodosLosAsignarServicio = async (req, res) => {
    try {
        const asignarServicio = await asignarServicioService.obtenerTodosLosAsignarServicios();
        return sendSuccess(res, asignarServicio, 'asignarServicio obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener asignarServicio', 500);
    }
};

/** get /cliente/:id
 * obtiene un cliente especifico por id
 */
const obtenerAsignarServicioPorId = async (req, res) => {
    try {
        const { id_asignacionServicio } = req.params;
        // llamar al servicio obtenerasignarServicioPorId(id_asignarServicio)
        const asignarServicio = await asignarServicioService.obtenerAsignarServicioPorId(id_asignacionServicio); 
        
        // si no existe retrona el error 404
        if (!asignarServicio) {
            return sendError(res, 'asignarServicio no encontrado', 404);
        } else {
            return sendSuccess(res, asignarServicio, 'asignarServicio obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el asignarServicio', 500);
    }
};

/** patch /cliente/:id
 * actualizar cliente
 */
const actualizarAsignarServicio = async (req, res) => {
    try {
        const validacion = updateAsignarServicioSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_asignacionServicio;
        const resultado = await asignarServicioService.actualizarAsignarServicio(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'asignarServicio no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'asignarServicio actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar asignarServicio', 500);
    }
};

/** delete /asignarServicio/:id
 * eliminar asignarServicio
 */
const eliminarAsignarServicio = async (req, res) => {
    try {
        const { id_asignacionServicio } = req.params;
        // llamar al servicio eliminarasignarServicio(id_asignarServicio)
        const eliminado = await asignar_servicioService.eliminarAsignarServicio(id_asignacionServicio);

        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'asignarServicio no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'asignarServicio eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar asignarServicio', 500);
    }
};

module.exports = {
    createAsignarServicio,
    obtenerTodosLosAsignarServicio,
    obtenerAsignarServicioPorId,
    actualizarAsignarServicio,
    eliminarAsignarServicio
};