const { sendSuccess, sendError } = require('../handlers/responseHandler');
const checklistService = require('../services/checklistService');
const { createChecklistSchema, updateChecklistSchema } = require('../validations/checklistValidation');

/** post /checklist
 * crear un nuevo checklist
 */
const crearChecklist = async (req, res) => {
    try {
        const { error, value } = createChecklistSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const checklistCreado = await checklistService.crearCheckList(value);
        return sendSuccess(res, checklistCreado, 'Checklist creado con exito', 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear la checklist', 500);
    }
};

/** get /cheklist
 * obtiene todos las checklist
 */
const obtenerTodosLosChecklist = async (req, res) => {
    try {
        const checklist = await checklistService.obtenerTodosLosCheckList();
        return sendSuccess(res, checklist, 'checklist obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener checklist', 500);
    }
};

/** get /checklist/:id
 * obtiene un checklist especifico por id
 */
const obtenerChecklistPorId = async (req, res) => {
    try {
        const { id_checklist } = req.params;
        // llamar al servicio obtenerchecklistPorId(id_checklist)
        const checklist = await checklistService.obtenerCheckListPorId(id_checklist); 
        
        // si no existe retrona el error 404
        if (!checklist) {
            return sendError(res, 'checklist no encontrado', 404);
        } else {
            return sendSuccess(res, checklist, 'checklist obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el checklist', 500);
    }
};

/** patch /checklist/:id
 * actualizar checklist
 */
const actualizarChecklist = async (req, res) => {
    try {
        const validacion = updateChecklistSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_checklist;
        const resultado = await checklistService.actualizarCheckList(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'checklist no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'checklist actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar checklist', 500);
    }
};

/** delete /checklist/:id
 * eliminar checklist
 */
const eliminarChecklist = async (req, res) => {
    try {
        const { id_checklist } = req.params;
        // llamar al servicio eliminarchecklist(id_checklist)
        const eliminado = await checklistService.eliminarCheckList(id_checklist);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'checklist no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'checklist eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar checklist', 500);
    }
};

module.exports = {
    crearChecklist,
    obtenerTodosLosChecklist,
    obtenerChecklistPorId,
    actualizarChecklist,
    eliminarChecklist
};