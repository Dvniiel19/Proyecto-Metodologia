const { sendSuccess, sendError } = require('../handlers/responseHandler');
const consumoInsumoService = require('../services/consumoInsumoService');
const { createConsumoInsumoSchema, updateConsumoInsumoSchema } = require('../validations/consumoInsumoValidation');

/** post /consumo_insumo
 * crear un nuevo consumo_insumo
 */
const crearConsumoInsumo = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createConsumoInsumoSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el consumo_insumo
        const consumoInsumoCreado = await consumoInsumoService.crearConsumoInsumo(value);
        // respondemos con exito
        return sendSuccess(
            res,
            consumoInsumoCreado,
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
const obtenerTodosLosConsumoInsumo = async (req, res) => {
    try {
        const consumoInsumo = await consumoInsumoService.obtenerTodosLosConsumoInsumo();
        return sendSuccess(res, consumoInsumo, 'consumo insumo obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener consumo_insumo', 500);
    }
};

/** get /consumo_insumo/:id
 * obtiene un consumo_insumo especifico por id
 */
const obtenerConsumoInsumoPorId = async (req, res) => {
    try {
        const { id_consumo } = req.params;
        const consumoInsumo = await consumoInsumoService.obtenerConsumoInsumoPorId(id_consumo); 
        
        if (!consumoInsumo) {
            return sendError(res, 'consumo_insumo no encontrado', 404);
        } else {
            return sendSuccess(res, consumoInsumo, 'consumo insumo obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el consumo_insumo', 500);
    }
};

/** patch /consumo_insumo/:id
 * actualizar consumo_insumo
 */
const actualizarConsumoInsumo = async (req, res) => {
    try {
        const validacion = updateConsumoInsumoSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_consumo;
        const resultado = await consumoInsumoService.actualizarConsumoInsumo(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'consumo insumo no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'consumo insumo actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar consumo_insumo', 500);
    }
};

/** delete /consumo_insumo/:id
 * eliminar consumo_insumo
 */
const eliminarConsumoInsumo = async (req, res) => {
    try {
        const { id_consumo } = req.params;
        const eliminado = await consumoInsumoService.eliminarConsumoInsumo(id_consumo);
        
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
    crearConsumoInsumo,
    obtenerTodosLosConsumoInsumo,
    obtenerConsumoInsumoPorId,
    actualizarConsumoInsumo,
    eliminarConsumoInsumo
};