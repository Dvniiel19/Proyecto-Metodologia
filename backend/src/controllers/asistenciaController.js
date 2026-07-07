const { sendSuccess, sendError } = require('../handlers/responseHandler');
const asistenciaService = require('../services/asistenciaService');
const { createAsistenciaSchema, updateAsistenciaSchema, registrarEntradaSchema, registrarInasistenciaSchema } = require('../validations/asistenciaValidation');

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

//  Reloj control: entrada. Valida los ids con Joi (fecha y hora las genera el servicio).
/** post /asistencia/entrada
 * el trabajador ficha su entrada — genera fecha y hora automaticamente
 */
const registrarEntrada = async (req, res) => {
    try {
        const { error, value } = registrarEntradaSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const { id_trabajador, id_servicio } = value;

        const asistencia = await asistenciaService.registrarEntrada(id_trabajador, id_servicio);
        if (asistencia.error === 'entrada_abierta') {
            return sendError(res, 'El trabajador ya tiene una entrada registrada sin salida', 409);
        }
        if (asistencia.error === 'ya_ficho_hoy') {
            return sendError(res, 'Ya cerraste tu jornada de hoy en este servicio; podrás volver a fichar mañana', 409);
        }
        return sendSuccess(res, asistencia, 'Entrada registrada exitosamente', 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al registrar la entrada', 500);
    }
};

// Registro manual de inasistencia (lo hace un supervisor o coordinador).
/** post /asistencia/inasistencia
 * asienta la ausencia de un trabajador en un servicio y fecha determinados
 */
const registrarInasistencia = async (req, res) => {
    try {
        const { error, value } = registrarInasistenciaSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const { id_trabajador, id_servicio, fecha } = value;

        const inasistencia = await asistenciaService.registrarInasistencia(id_trabajador, id_servicio, fecha);
        if (inasistencia.error === 'ya_registrada') {
            return sendError(res, 'Ya existe un registro de asistencia para ese trabajador, servicio y fecha', 409);
        }
        return sendSuccess(res, inasistencia, 'Inasistencia registrada exitosamente', 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al registrar la inasistencia', 500);
    }
};

// Reloj control: salida. Retorna 409 si la salida ya fue registrada (doble fichaje).
/** patch /asistencia/:id/salida
 * el trabajador ficha su salida — completa el registro existente
 */
const registrarSalida = async (req, res) => {
    try {
        const { id_asistencia } = req.params;
        const resultado = await asistenciaService.registrarSalida(id_asistencia);

        if (!resultado) {
            return sendError(res, 'Registro de asistencia no encontrado', 404);
        }
        if (resultado.error === 'ya_registrada') {
            return sendError(res, 'La salida ya fue registrada para esta asistencia', 409);
        }

        return sendSuccess(res, resultado, 'Salida registrada exitosamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al registrar la salida', 500);
    }
};

// Historial de asistencias filtrado por trabajador (para la vista del trabajador en el front).
/** get /asistencia/trabajador/:id_trabajador
 * obtiene todos los registros de asistencia de un trabajador
 */
const obtenerAsistenciasPorTrabajador = async (req, res) => {
    try {
        const { id_trabajador } = req.params;
        const asistencias = await asistenciaService.obtenerAsistenciasPorTrabajador(id_trabajador);
        return sendSuccess(res, asistencias, 'Asistencias del trabajador obtenidas correctamente');
    } catch (error) {
        return sendError(res, 'Error al obtener asistencias del trabajador', 500);
    }
};

module.exports = {
    crearAsistencia,
    obtenerTodasLasAsistencia,
    obtenerAsistenciaPorId,
    actualizarAsistencia,
    eliminarAsistencia,
    registrarEntrada,
    registrarSalida,
    registrarInasistencia,
    obtenerAsistenciasPorTrabajador,
};