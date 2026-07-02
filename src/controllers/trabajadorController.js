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
        // llamamos al servicio para crear el trabajador
        const trabajadorCreado = await trabajadorService.crearTrabajador(value);
        // respondemos con exito
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
        // llamar al servicio obtenerTrabajadorPorId(id_trabajador)
        const trabajador = await trabajadorService.obtenerTrabajadorPorId(id_trabajador); 
        
        // si no existe retrona el error 404
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
        
        // Verificamos si el joi encontro errores de validacion
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
        // llamar al servicio eliminarTrabajador(id_trabajador)
        const eliminado = await trabajadorService.eliminarTrabajador(id_trabajador);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'Trabajador no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Trabajador eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar trabajador', 500);
    }
};

module.exports = {
    crearTrabajador,
    obtenerTodosLosTrabajador,
    obtenerTrabajadorPorId,
    actualizarTrabajador,
    eliminarTrabajador
};