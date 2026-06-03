const { sendSuccess, sendError } = require('../handlers/responseHandler');
const consumo_insumoService = require('../services/consumo_insumoService');
const { createConsumo_insumoSchema, updateConsumo_insumoSchema } = require('../validations/consumo_insumoValidation');

/** post /consumo_insumo
 * crear un nuevo consumo_insumo
 */
const crearConsumo_insumo = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createConsumo_insumoSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el consumo_insumo
        const consumo_insumoCreado = await consumo_insumoService.crearconsumo_insumo(value);
        // respondemos con exito
        return sendSuccess(
            res,
            consumo_insumoCreado,
            'consumo_insumo creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el consumo_insumo', 500);
    }
};

/** get /consumo_insumo
 * obtiene todos los consumo_insumos
 */
const obtenerTodosLosConsumo_insumo = async (req, res) => {
    try {
        const consumo_insumo = await consumo_insumoService.obtenerTodosLosConsumo_insumos();
        return sendSuccess(res, consumo_insumo, 'consumo_insumo obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener consumo_insumo', 500);
    }
};

/** get /consumo_insumo/:id
 * obtiene un consumo_insumo especifico por id
 */
const obtenerConsumo_insumoPorId = async (req, res) => {
    try {
        const { id_consumo_insumo } = req.params;
        // llamar al servicio obtenerconsumo_insumoPorId(id_consumo_insumo)
        const consumo_insumo = await consumo_insumoService.obtenerConsumo_insumoPorId(id_consumo_insumo); 
        
        // si no existe retrona el error 404
        if (!consumo_insumo) {
            return sendError(res, 'consumo_insumo no encontrado', 404);
        } else {
            return sendSuccess(res, consumo_insumo, 'consumo_insumo obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el consumo_insumo', 500);
    }
};

/** patch /consumo_insumo/:id
 * actualizar consumo_insumo
 */
const actualizarConsumo_insumo = async (req, res) => {
    try {
        const validacion = updateConsumo_insumoSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_consumo_insumo;
        const resultado = await consumo_insumoService.actualizarConsumo_insumo(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'consumo_insumo no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'consumo_insumo actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar consumo_insumo', 500);
    }
};

/** delete /consumo_insumo/:id
 * eliminar consumo_insumo
 */
const eliminarConsumo_insumo = async (req, res) => {
    try {
        const { id_consumo_insumo } = req.params;
        // llamar al servicio eliminarconsumo_insumo(id_consumo_insumo)
        const eliminado = await consumo_insumoService.eliminarConsumo_insumo(id_consumo_insumo);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'consumo_insumo no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'consumo_insumo eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar consumo_insumo', 500);
    }
};

module.exports = {
    crearConsumo_insumo,
    obtenerTodosLosConsumo_insumo,
    obtenerConsumo_insumoPorId,
    actualizarConsumo_insumo,
    eliminarConsumo_insumo
};