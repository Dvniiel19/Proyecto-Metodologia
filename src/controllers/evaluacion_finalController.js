const { sendSuccess, sendError } = require('../handlers/responseHandler');
const evaluacion_finalService = require('../services/evaluacion_finalService');
const { createEvaluacion_FinalSchema, updateEvaluacion_finalSchema } = require('../validations/evaluacion_finalValidation');

/** post /evaluacion_final
 * crear un nuevo evaluacion_final
 */
const crearEvaluacion_Final = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createEvaluacion_FinalSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el evaluacion_final
        const evaluacion_finalCreado = await evaluacion_finalService.crearEvaluacion_Final(value);
        // respondemos con exito
        return sendSuccess(
            res,
            evaluacion_finalCreado,
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
const obtenerTodosLosEvaluacion_Final = async (req, res) => {
    try {
        const evaluacion_final = await evaluacion_finalService.obtenerTodosLosEvaluacion_Final();
        return sendSuccess(res, evaluacion_final, 'evaluacion_final obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener evaluacion_final', 500);
    }
};

/** get /evaluacion_final/:id
 * obtiene un evaluacion_final especifico por id
 */
const obtenerEvaluacion_FinalPorId = async (req, res) => {
    try {
        const { id_evaluacion_final } = req.params;
        // llamar al servicio obtenerEvaluacion_FinalPorId(id_evaluacion_final)
        const evaluacion_final = await evaluacion_finalService.obtenerEvaluacion_FinalPorId(id_evaluacion_final); 
        
        // si no existe retrona el error 404
        if (!evaluacion_final) {
            return sendError(res, 'evaluacion_final no encontrado', 404);
        } else {
            return sendSuccess(res, evaluacion_final, 'evaluacion_final obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el evaluacion_final', 500);
    }
};

/** patch /evaluacion_final/:id
 * actualizar evaluacion_final
 */
const actualizarEvaluacion_Final = async (req, res) => {
    try {
        const validacion = updateEvaluacion_FinalSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_evaluacion_final;
        const resultado = await evaluacion_finalService.actualizarEvaluacion_Final(obtenerid, validacion.value);
    
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
const eliminarEvaluacion_Final = async (req, res) => {
    try {
        const { id_evaluacion_final } = req.params;
        // llamar al servicio eliminarevaluacion_final(id_evaluacion_final)
        const eliminado = await evaluacion_finalService.eliminarEvaluacion_Final(id_evaluacion_final);
        
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
    crearEvaluacion_Final,
    obtenerTodosLosEvaluacion_Final,
    obtenerEvaluacion_FinalPorId,
    actualizarEvaluacion_Final,
    eliminarEvaluacion_Final
};