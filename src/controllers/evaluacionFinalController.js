const { sendSuccess, sendError } = require('../handlers/responseHandler');
const evaluacionFinalService = require('../services/evaluacionFinalService');
const { createEvaluacionFinalSchema, updateEvaluacionFinalSchema } = require('../validations/evaluacionFinalValidation');

/** post /evaluacion_final
 * crear un nuevo evaluacion_final
 */
const crearEvaluacionFinal = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createEvaluacionFinalSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el evaluacion_final
        const evaluacionFinalCreado = await evaluacionFinalService.crearEvaluacionFinal(value);
        // respondemos con exito
        return sendSuccess(
            res,
            evaluacionFinalCreado,
            'evaluacion_final creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el evaluacion_final', 500);
    }
};

/** get /evaluacion_final
 * obtiene todos los evaluacion_finals
 */
const obtenerTodasLasEvaluacionFinal = async (req, res) => {
    try {
        const evaluacionFinal = await evaluacionFinalService.obtenerTodasLasEvaluacionFinal();
        return sendSuccess(res, evaluacionFinal, 'evaluacion_final obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener evaluacion_final', 500);
    }
};

/** get /evaluacion_final/:id
 * obtiene un evaluacion_final especifico por id
 */
const obtenerEvaluacionFinalPorId = async (req, res) => {
    try {
        const { id_evaluacion } = req.params;
        // llamar al servicio obtenerEvaluacion_FinalPorId(id_evaluacion_final)
        const evaluacionFinal = await evaluacionFinalService.obtenerEvaluacionFinalPorId(id_evaluacion); 
        
        // si no existe retrona el error 404
        if (!evaluacionFinal) {
            return sendError(res, 'evaluacion_final no encontrado', 404);
        } else {
            return sendSuccess(res, evaluacionFinal, 'evaluacion_final obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el evaluacion_final', 500);
    }
};

/** patch /evaluacion_final/:id
 * actualizar evaluacion_final
 */
const actualizarEvaluacionFinal = async (req, res) => {
    try {
        const validacion = updateEvaluacionFinalSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_evaluacion;
        const resultado = await evaluacionFinalService.actualizarEvaluacionFinal(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'evaluacion_final no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'evaluacion_final actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar evaluacion_final', 500);
    }
};

/** delete /evaluacion_final/:id
 * eliminar evaluacion_final
 */
const eliminarEvaluacionFinal = async (req, res) => {
    try {
        const { id_evaluacion} = req.params;
        // llamar al servicio eliminarevaluacion_final(id_evaluacion_final)
        const eliminado = await evaluacionFinalService.eliminarEvaluacionFinal(id_evaluacion);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'evaluacion_final no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'evaluacion_final eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar evaluacion_final', 500);
    }
};

module.exports = {
    crearEvaluacionFinal,
    obtenerTodasLasEvaluacionFinal,
    obtenerEvaluacionFinalPorId,
    actualizarEvaluacionFinal,
    eliminarEvaluacionFinal
};