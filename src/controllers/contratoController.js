const { sendSuccess, sendError } = require('../handlers/responseHandler');
const contratoService = require('../services/contratoService');
const { createContratoSchema, updateContratoSchema } = require('../validations/contratoValidation');

/** post /contrato
 * crear un nuevo contrato
 */
const crearContrato = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createContratoSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el contrato
        const contratoCreado = await contratoService.crearcontrato(value);
        // respondemos con exito
        return sendSuccess(
            res,
            contratoCreado,
            'Contrato creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el contrato', 500);
    }
};

/** get /contrato
 * obtiene todos los contratos
 */
const obtenerTodosLosContrato = async (req, res) => {
    try {
        const contrato = await contratoService.obtenerTodosLoscontratos();
        return sendSuccess(res, contrato, 'contrato obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener contrato', 500);
    }
};

/** get /contrato/:id
 * obtiene un contrato especifico por id
 */
const obtenercontratoPorId = async (req, res) => {
    try {
        const { id_contrato } = req.params;
        // llamar al servicio obtenercontratoPorId(id_contrato)
        const contrato = await contratoService.obtenerContratoPorId(id_contrato); 
        
        // si no existe retrona el error 404
        if (!contrato) {
            return sendError(res, 'contrato no encontrado', 404);
        } else {
            return sendSuccess(res, contrato, 'contrato obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el contrato', 500);
    }
};

/** patch /contrato/:id
 * actualizar contrato
 */
const actualizarcontrato = async (req, res) => {
    try {
        const validacion = updatecontratoSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_contrato;
        const resultado = await contratoService.actualizarcontrato(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'contrato no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'contrato actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar contrato', 500);
    }
};

/** delete /contrato/:id
 * eliminar contrato
 */
const eliminarcontrato = async (req, res) => {
    try {
        const { id_contrato } = req.params;
        // llamar al servicio eliminarcontrato(id_contrato)
        const eliminado = await contratoService.eliminarcontrato(id_contrato);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'contrato no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'contrato eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar contrato', 500);
    }
};

module.exports = {
    crearcontrato,
    obtenerTodosLoscontrato,
    obtenercontratoPorId,
    actualizarcontrato,
    eliminarcontrato
};