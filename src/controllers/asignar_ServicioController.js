const { sendSuccess, sendError } = require('../handlers/responseHandler');
const AsignarServicioService = require('../services/asignar_servicioService');
const { createAsignarServicioSchema, updateasignarServicioSchema } = require('../validations/asignar_ServicioValidation');

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
        const asignarServicioCreado = await AsignarServicioService.crearAsignarServicio(value);
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
const obtenerTodosLosasignarServicio = async (req, res) => {
    try {
        const asignarServicio = await AsignarServicioService.obtenerTodosLosasignarServicios();
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
        const { id_asignarServicio } = req.params;
        // llamar al servicio obtenerasignarServicioPorId(id_asignarServicio)
        const asignarServicio = await AsignarServicioService.obtenerAsignarServicioPorId(id_asignarServicio); 
        
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
        const validacion = updatefehaprogramaSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_asignarServicio;
        const resultado = await AsignarServicioService.actualizarAsignarServicio(obtenerid, validacion.value);
    
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
        const { id_asignarServicio } = req.params;
        // llamar al servicio eliminarasignarServicio(id_asignarServicio)
        const eliminado = await AsignarServicioService.eliminarAsignarServicio(id_asignarServicio);

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
    obtenerTodosLosasignarServicio,
    obtenerAsignarServicioPorId,
    actualizarAsignarServicio,
    eliminarAsignarServicio
};