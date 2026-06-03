const { sendSuccess, sendError } = require('../handlers/responseHandler');
const asistenciaService = require('../services/asistenciaService');
const { createAsistenciaSchema, updateAsistenciaSchema } = require('../validations/asistenciaValidation');

/** post /asistencia
 * crear un nuevo registro de asistencia
 */
const crearAsistencia = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createAsistenciaSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el agenda
        const asistenciaCreada = await asistenciaService.crearAsistencia(value);
        // respondemos con exito
        return sendSuccess(
            res,
            asistenciaCreada,
            'asistencia creada con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el asistencia', 500);
    }
};

/** get /asistencia
 * obtiene todos los registros de asistencia
 */
const obtenerTodasLasAsistencia = async (req, res) => {
    try {
        const asistencia = await asistenciaService.obtenerTodasLasAsistencias();
        return sendSuccess(res, asistencia, 'asistencia obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener asistencia', 500);
    }
};

/** get /asistencia/:id
 * obtiene un registro de asistencia por id
 */
const obtenerAsistenciaPorId = async (req, res) => {
    try {
        const { id_asistencia } = req.params;
        // llamar al servicio obtenerasistenciaPorId(id_asistencia)
        const asistencia = await asistenciaService.obtenerAsistenciaPorId(id_asistencia); 
        
        // si no existe retrona el error 404
        if (!asistencia) {
            return sendError(res, 'asistencia no encontrada', 404);
        } else {
            return sendSuccess(res, asistencia, 'asistencia obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la asistencia', 500);
    }
};

/** patch /asistencia/:id
 * actualizar asistencia
 */
const actualizarAsistencia = async (req, res) => {
    try {
        const validacion = updateAsistenciaSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_asistencia;
        const resultado = await asistenciaService.actualizarAsistencia(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'asistencia no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'asistencia actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar asistencia', 500);
    }
};

/** delete /asistencia/:id
 * eliminar asistencia
 */
const eliminarAsistencia = async (req, res) => {
    try {
        const { id_asistencia } = req.params;
        // llamar al servicio eliminarasistencia(id_asistencia)
        const eliminado = await asistenciaService.eliminarAsistencia(id_asistencia);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'asistencia no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'asistencia eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar asistencia', 500);
    }
};

module.exports = {
    crearAsistencia,
    obtenerTodasLasAsistencia,
    obtenerAsistenciaPorId,
    actualizarAsistencia,
    eliminarAsistencia
};