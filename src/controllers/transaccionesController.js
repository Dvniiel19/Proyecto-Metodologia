const { sendSuccess, sendError } = require('../handlers/responseHandler');
const transaccionesService = require('../services/transaccionesService');
const { createTransaccionSchema, updateTransaccionSchema } = require('../validations/transaccionesValidation');

/** post /transaccion
 crear una nueva transaccion
 */
const crearTransaccion = async (req, res) => {
    try {
        // Validamos los datos de entrada con Joi
        const { error, value } = createTransaccionSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validación de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // Llamamos al servicio para crear la transacción
        const transaccionCreada = await transaccionesService.crearTransaccion(value);
        // Respondemos con éxito
        return sendSuccess(
            res,
            transaccionCreada,
            'Transacción creada con éxito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear la transacción', 500);
    }
};

/** get /transaccion
 * obtiene todas las transacciones
 */
const obtenerTodasLasTransacciones = async (req, res) => {
    try {
        const transacciones = await transaccionesService.obtenerTodasLasTransacciones();
        return sendSuccess(res, transacciones, 'Transacciones obtenidas exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener transacciones', 500);
    }
};

/** get /transaccion/:id_transaccion
 * obtiene una transaccion específica por id
 */
const obtenerTransaccionPorId = async (req, res) => {
    try {
        const { id_transaccion } = req.params;
        const transaccion = await transaccionesService.obtenerTransaccionPorId(id_transaccion); 
        
        // Si no existe retorna el error 404
        if (!transaccion) {
            return sendError(res, 'Transacción no encontrada', 404);
        } else {
            return sendSuccess(res, transaccion, 'Transacción obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la transacción', 500);
    }
};

/** patch /transaccion/:id_transaccion
 * actualizar transaccion
 */
const actualizarTransaccion = async (req, res) => {
    try {
        const validacion = updateTransaccionSchema.validate(req.body);
        
        // Verificamos si Joi encontró errores de validación
        if (validacion.error) {
            return sendError(
                res,
                'Error de validación de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_transaccion;
        const resultado = await transaccionesService.actualizarTransaccion(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Transacción no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'Transacción actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar transacción', 500);
    }
};

/** delete /transaccion/:id_transaccion
 * eliminar transaccion
 */
const eliminarTransaccion = async (req, res) => {
    try {
        const { id_transaccion } = req.params;
        const eliminado = await transaccionesService.eliminarTransaccion(id_transaccion);
        
        // Si no se eliminó retornar error 404
        if (!eliminado) {
            return sendError(res, 'Transacción no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'Transacción eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar transacción', 500);
    }
};

module.exports = {
    crearTransaccion,
    obtenerTodasLasTransacciones,
    obtenerTransaccionPorId,
    actualizarTransaccion,
    eliminarTransaccion
};