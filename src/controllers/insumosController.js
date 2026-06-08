const { sendSuccess, sendError } = require('../handlers/responseHandler');
const insumosService = require('../services/insumosService');
const { createInsumosSchema, updateInsumosSchema } = require('../validations/insumosValidation');

/** post /insumos
 * crear un nuevo insumo
 */
const crearInsumos = async (req, res) => {
    try {
        const { error, value } = createInsumosSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const insumosCreado = await insumosService.crearInsumos(value);
        return sendSuccess(res, insumosCreado, 'Insumo creado con exito', 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el insumo', 500);
    }
};

/** get /insumos
 * obtiene todos los insumos
 */
const obtenerTodosLosInsumos = async (req, res) => {
    try {
        const listaInsumos = await insumosService.obtenerTodosLosInsumos();
        return sendSuccess(res, listaInsumos, 'Insumos obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener insumos', 500);
    }
};

/** get /insumos/:id
 * obtiene un insumo específico por su ID
 */
const obtenerInsumosPorId = async (req, res) => {
    try {
        const { id_insumo } = req.params;
        const insumoEncontrado = await insumosService.obtenerInsumoPorId(id_insumo); 
        if (!insumoEncontrado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, insumoEncontrado, 'Insumo obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el insumo', 500);
    }
};

/** patch /insumos/:id
 * actualizar insumo
 */
const actualizarInsumos = async (req, res) => {
    try {
        const validacion = updateInsumosSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_insumo;
        const resultado = await insumosService.actualizarInsumo(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'Insumo actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar insumo', 500);
    }
};

/** delete /insumos/:id
 * eliminar insumo
 */
const eliminarInsumos = async (req, res) => {
    try {
        const { id_insumo } = req.params;
        const eliminado = await insumosService.eliminarInsumo(id_insumo);
        
        if (!eliminado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Insumo eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar insumo', 500);
    }
};

module.exports = {
    crearInsumos,
    obtenerTodosLosInsumos,
    obtenerInsumosPorId,
    actualizarInsumos,
    eliminarInsumos
};