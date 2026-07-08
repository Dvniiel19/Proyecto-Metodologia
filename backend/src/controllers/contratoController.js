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
        const contratoCreado = await contratoService.crearContrato(value);
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
        const contrato = await contratoService.obtenerTodosLosContratos();
        return sendSuccess(res, contrato, 'contrato obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener contrato', 500);
    }
};

/** get /contrato/:id
 * obtiene un contrato especifico por id
 */
const obtenerContratoPorId = async (req, res) => {
    try {
        const { id_contrato } = req.params;
        // llamar al servicio obtenerContratoPorId(id_contrato)
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
const actualizarContrato = async (req, res) => {
    try {
        const validacion = updateContratoSchema.validate(req.body);
        
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
        const resultado = await contratoService.actualizarContrato(obtenerid, validacion.value);
    
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
const db = require('../config/db');



const eliminarContrato = async (req, res) => {
    try {
        // Extraemos id_contrato tal como viene definido en tu archivo de rutas
        const { id_contrato } = req.params; 

        if (!id_contrato) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de contrato no proporcionado.'
            });
        }

        // Ejecutamos la query directa
        await db.query('DELETE FROM contrato WHERE id_contrato = $1', [id_contrato]);

        return res.status(200).json({
            status: 'success',
            message: 'Contrato eliminado correctamente'
        });

    } catch (error) {
        console.error('Error crítico al eliminar contrato:', error.message);
        
        // Captura el error en español si está amarrado a otra tabla
        if (error.message.includes('foreign key') || error.message.includes('violates')) {
            return res.status(400).json({
                status: 'error',
                message: 'No se puede eliminar este contrato porque tiene servicios agendados o tareas activas vinculadas.'
            });
        }

        // Por si la tabla se llama 'contratos' en plural en tu BD
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
            try {
                await db.query('DELETE FROM contratos WHERE id_contrato = $1', [id_contrato]);
                return res.status(200).json({
                    status: 'success',
                    message: 'Contrato eliminado correctamente'
                });
            } catch (pluralError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo eliminar el contrato debido a un error de consistencia.'
                });
            }
        }

        return res.status(400).json({
            status: 'error',
            message: 'No se puede eliminar este contrato debido a restricciones o dependencias activas en el sistema.'
        });
    }
};


module.exports = {
   
};

module.exports = {
    crearContrato,
    obtenerTodosLosContrato,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato
};