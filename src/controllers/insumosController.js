const { sendSuccess, sendError } = require('../handlers/responseHandler');
const insumosService = require('../services/insumosService');
const { createInsumosSchema, updateInsumosSchema } = require('../validations/insumosValidation');

/** post /insumos
 * crear un nuevo insumos
 */
const crearInsumos = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createInsumosSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el insumos
        const insumosCreado = await insumosService.crearinsumos(value);
        // respondemos con exito
        return sendSuccess(
            res,
            insumosCreado,
            'insumos creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el insumos', 500);
    }
};

/** get /insumos
 * obtiene todos los insumoss
 */
const obtenerTodosLosInsumos = async (req, res) => {
    try {
        const insumos = await insumosService.obtenerTodosLosInsumoss();
        return sendSuccess(res, insumos, 'insumos obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener insumos', 500);
    }
};

/** get /insumos/:id
 * obtiene un insumos especifico por id
 */
const obtenerInsumosPorId = async (req, res) => {
    try {
        const { id_insumos } = req.params;
        // llamar al servicio obtenerinsumosPorId(id_insumos)
        const insumos = await insumosService.obtenerInsumosPorId(id_insumos); 
        
        // si no existe retrona el error 404
        if (!insumos) {
            return sendError(res, 'insumos no encontrado', 404);
        } else {
            return sendSuccess(res, insumos, 'insumos obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el insumos', 500);
    }
};

/** patch /insumos/:id
 * actualizar insumos
 */
const actualizarInsumos = async (req, res) => {
    try {
        const validacion = updateInsumosSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_insumos;
        const resultado = await insumosService.actualizarInsumos(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'insumos no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'insumos actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar insumos', 500);
    }
};

/** delete /insumos/:id
 * eliminar insumos
 */
const eliminarInsumos = async (req, res) => {
    try {
        const { id_insumos } = req.params;
        // llamar al servicio eliminarinsumos(id_insumos)
        const eliminado = await insumosService.eliminarInsumos(id_insumos);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'insumos no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'insumos eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar insumos', 500);
    }
};

module.exports = {
    crearInsumos,
    obtenerTodosLosInsumos,
    obtenerInsumosPorId,
    actualizarInsumos,
    eliminarInsumos
};