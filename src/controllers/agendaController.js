const { sendSuccess, sendError } = require('../handlers/responseHandler');
const agendaService = require('../services/agendaService');
const { createAgendaSchema, updateAgendaSchema } = require('../validations/agendaValidation');

/** post /agenda
 * crear un nuevo evento en la agenda
 */
const crearAgenda = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createAgendaSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el agenda
        const agendaCreada = await agendaService.crearAgenda(value);
        // respondemos con exito
        return sendSuccess(
            res,
            agendaCreada,
            'agenda creada con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el agenda', 500);
    }
};

/** get /agenda
 * obtiene todos los eventos en la agenda
 */
const obtenerTodasLasAgenda = async (req, res) => {
    try {
        const agenda = await agendaService.obtenerTodasLasAgenda();
        return sendSuccess(res, agenda, 'agenda obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener agenda', 500);
    }
};

/** get /agenda/:id
 * obtiene un evento en la agenda por id
 */
const obtenerAgendaPorId = async (req, res) => {
    try {
        const { id_agenda } = req.params;
        // llamar al servicio obteneragendaPorId(id_agenda)
        const agenda = await agendaService.obtenerAgendaPorId(id_agenda); 
        
        // si no existe retrona el error 404
        if (!agenda) {
            return sendError(res, 'agenda no encontrada', 404);
        } else {
            return sendSuccess(res, agenda, 'agenda obtenida correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener la agenda', 500);
    }
};

/** patch /agenda/:id
 * actualizar agenda
 */
const actualizarAgenda = async (req, res) => {
    try {
        const validacion = updateAgendaSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_agenda;
        const resultado = await agendaService.actualizarAgenda(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'agenda no encontrada', 404);
        } else {
            return sendSuccess(res, resultado, 'agenda actualizada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar agenda', 500);
    }
};

/** delete /agenda/:id
 * eliminar agenda
 */
const eliminarAgenda = async (req, res) => {
    try {
        const { id_agenda } = req.params;
        // llamar al servicio eliminaragenda(id_agenda)
        const eliminado = await agendaService.eliminarAgenda(id_agenda);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'agenda no encontrada', 404);
        } else {
            return sendSuccess(res, null, 'agenda eliminada correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar agenda', 500);
    }
};

module.exports = {
    crearAgenda,
    obtenerTodasLasAgenda,
    obtenerAgendaPorId,
    actualizarAgenda,
    eliminarAgenda
};