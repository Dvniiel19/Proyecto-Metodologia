"use strict";

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const insumosService = require('../services/insumosService');
const { createInsumosSchema, updateInsumosSchema,movimientoInsumoSchema } = require('../validations/insumosValidation');


/** post /insumos
 * crear un nuevo insumo
 */
const crearInsumos = async (req, res) => {
    try {
        const { error, value } = createInsumosSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        const insumosCreado = await insumosService.crearInsumos(value);
        return sendSuccess(res, insumosCreado, 'Insumo creado con exito', 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el insumo', 500);
    }
};

/** get /insumos
 * obtiene todos los insumos
 */
const obtenerTodosLosInsumos = async (req, res) => {
    try {
        const listaInsumos = await insumosService.obtenerTodosLosInsumos();
        return sendSuccess(res, listaInsumos, 'Insumos obtenidos exitosamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener insumos', 500);
    }
};

/** get /insumos/:id
 * obtiene un insumo especifico por su ID
 */
const obtenerInsumosPorId = async (req, res) => {
    try {
        const { id_insumo } = req.params;
        const insumoEncontrado = await insumosService.obtenerInsumoPorId(id_insumo); 
        if (!insumoEncontrado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, insumoEncontrado, 'Insumo obtenido correctamente');
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener el insumo', 500);
    }
};

/** patch /insumos/:id
 * actualizar insumo
 */
const actualizarInsumos = async (req, res) => {
    try {
        const validacion = updateInsumosSchema.validate(req.body);
        
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_insumo;
        const resultado = await insumosService.actualizarInsumo(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'Insumo actualizado correctamente');
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al actualizar insumo', 500);
    }
};

/** delete /insumos/:id
 * eliminar insumo
 */
const eliminarInsumos = async (req, res) => {
    try {
        const { id_insumo } = req.params;
        const eliminado = await insumosService.eliminarInsumo(id_insumo);
        
        if (!eliminado) {
            return sendError(res, 'Insumo no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'Insumo eliminado correctamente');
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al eliminar insumo', 500);
    }
};
//// MOVIMIENTO Y CONTROL DE STOCK CRITICO ///

/**
 * post /insumos/movimiento
 * Registra ingreso o salida de stock y evalua alertas criticas
 */
const registrarMovimientoInsumo = async(req, res)=> {
    try {
        const { error, value } = movimientoInsumoSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validación de datos',
                400,
                error.details.map(err => err.message)
            );
        }
//
        const { id_insumo, cantidad, tipo_movimiento, id_servicio, observaciones } = value;

        // Delegamos en el servicio, que usa db.getRepository (la API vieja getRepository de
        // typeorm no funciona con DataSource y lanzaba ConnectionNotFoundError en este endpoint)
        const respuesta = await insumosService.registrarMovimientoInsumo(
            id_insumo,
            cantidad,
            tipo_movimiento,
            id_servicio,
            observaciones
        );

        return sendSuccess(res, respuesta, `Movimiento de ${tipo_movimiento.toLowerCase()} registrado exitosamente`, 201);
    } catch (error) {
        // Los errores de negocio del servicio traen statusCode (404 / 400);
        // cualquier otro error es inesperado y se responde 500
        if (error.statusCode) {
            return sendError(res, error.message, error.statusCode);
        }
        console.error(error);
        return sendError(res, 'Error al registrar el movimiento de insumo', 500);
    }
};

/**
 * get /insumos/alertas
 * Obtiene todos los insumos en estado Critico
 */
const obtenerInsumosEnAlerta = async (req, res) => {
    try {
        const insumosEnAlerta = await insumosService.obtenerInsumosEnAlerta();
        return sendSuccess(res, insumosEnAlerta, "Insumos en alerta obtenidos correctamente");
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener insumos en alerta', 500);
    }
};

/**
 * GET /insumos/:id_insumo/historico
 * Obtiene el historico de movimientos de un insumo especifico
 */
const obtenerHistoricoMovimientos = async (req, res) => {
    try {
        const { id_insumo } = req.params;

        if (!id_insumo) {
            return sendError(res, 'ID de insumo requerido', 400);
        }

        const historico = await insumosService.obtenerHistoricoMovimientos(id_insumo);
        return sendSuccess(res, historico, 'Histórico de movimientos obtenido correctamente');
    } catch (error) {
        console.error('Error en obtenerHistoricoMovimientos:', error);
        return sendError(res, 'Error al obtener histórico de movimientos', 500);
    }
};

module.exports = {
    crearInsumos,
    obtenerTodosLosInsumos,
    obtenerInsumosPorId,
    actualizarInsumos,
    eliminarInsumos,
    registrarMovimientoInsumo,
    obtenerInsumosEnAlerta,
    obtenerHistoricoMovimientos,
};