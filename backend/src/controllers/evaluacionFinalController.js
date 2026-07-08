const { sendSuccess, sendError } = require('../handlers/responseHandler');
const evaluacionFinalService = require('../services/evaluacionFinalService');
const { createEvaluacionFinalSchema, updateEvaluacionFinalSchema } = require('../validations/evaluacionFinalValidation');
const { ESTADOS_AGENDA } = require('../constants/estadosAgenda');
const db = require('../config/db');

/** post /evaluacion_final
 * crear un nuevo evaluacion_final
 */
const crearEvaluacionFinal = async (req, res) => {
    try {
        const { error, value } = createEvaluacionFinalSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }

        //Extraer id_usuario del token JWT validado en el middleware de autenticacion
        const usuarioId = req.user?.id_usuario;
        if (!usuarioId) {
            return sendError(res, 'Usuario no autenticado', 401);
        }

        const { id_servicio } = value;

        const agendaRepository = db.getRepository('Agenda');
        const agenda = await agendaRepository.findOne({
            where: { id_servicio: id_servicio },
            // para verificar que el servicio corresponde al cliente que esta haciendo la evaluacion
            relations: ['contrato', 'contrato.cliente', 'contrato.cliente.usuario'] 
        });

        if (!agenda) {
            return sendError(res, 'El id_servicio no existe', 404);
        }
        // Solo se pueden evaluar servicios cuyo trabajo fue marcado como terminado
        // (PUT /agenda/:id/terminar-trabajo). Se mantienen 'Finalizado' y Completado' para compatibilidad con servicios antiguos que no pasaron por el flujo de evaluacion.
        const ESTADOS_EVALUABLES = [ESTADOS_AGENDA.PENDIENTE_EVALUACION, 'Finalizado', 'Completado'];
        if (!ESTADOS_EVALUABLES.includes(agenda.estado)) {
            return sendError(res, 'El trabajo del servicio aun no ha sido marcado como terminado, no se puede calificar', 400);
        }
        // Verificamos que el usuario que hace la evaluacion sea el titular del contrato del servicio
        const idUsuarioTitular = agenda.contrato?.cliente?.usuario?.id_usuario;
        if (!idUsuarioTitular) {
            return sendError(res, 'El servicio no tiene un contrato con cliente valido asociado, no se puede evaluar', 400);
        }
        if (idUsuarioTitular !== usuarioId) {
            return sendError(res, 'No tienes permisos para calificar este servicio', 403);
        }

        const evaluacionRepository = db.getRepository('EvaluacionFinal');
        const existeEvaluacion = await evaluacionRepository.findOne({
            where: { agenda: { id_servicio: id_servicio } }, // para verificar si ya existe una evaluacion para ese servicio
            relations: ['agenda']
        });
        if (existeEvaluacion) {
            return sendError(res, 'Ya hay una evaluacion para ese servicio', 409);
        }

        // Creamos la evaluacion final y actualizamos el estado del servicio a 'Finalizado'
        const evaluacionFinalCreado = await evaluacionFinalService.crearEvaluacionFinal(value);
        await agendaRepository.update(id_servicio, { estado: ESTADOS_AGENDA.FINALIZADO });

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
        const evaluacionFinal = await evaluacionFinalService.obtenerEvaluacionFinalPorId(id_evaluacion); 
        
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
        const eliminado = await evaluacionFinalService.eliminarEvaluacionFinal(id_evaluacion);
        
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