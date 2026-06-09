"use strict";

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const insumosService = require('../services/insumosService');
const { createInsumosSchema, updateInsumosSchema } = require('../validations/insumosValidation');
const { getRepository } = require('typeorm');

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
 * obtiene un insumo específico por su ID
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

        const { id_insumo, cantidad, tipo_movimiento, id_servicio, observaciones } = req.body;

        if (!id_insumo || !cantidad || !tipo_movimiento || !id_servicio) {
            return sendError(res, 'Parámetros incompletos. Se requieren: id_insumo, cantidad, tipo_movimiento, id_servicio', 400);
        }

        if (!['ingreso', 'salida'].includes(tipo_movimiento.toLowerCase())) {
            return sendError(res, 'tipo_movimiento debe ser "ingreso" o "salida"', 400);
        }

        const cantidadInt = parseInt(cantidad);
        if (cantidadInt <= 0) {
            return sendError(res, 'La cantidad debe ser mayor a 0', 400);
        }

        const insumoRepository = getRepository('Insumo');
        const consumoInsumoRepository = getRepository('ConsumoInsumo');

        const insumo = await insumoRepository.findOne({ where: { id_insumo: parseInt(id_insumo) } });
        if (!insumo) {
            return sendError(res, `Insumo con ID ${id_insumo} no encontrado`, 404);
        }

        let nuevoStock;
        const tipoMovimientoLower = tipo_movimiento.toLowerCase();

        if (tipoMovimientoLower === 'salida') {
            if (cantidadInt > insumo.stock) {
                return sendError(res, `Stock insuficiente. Disponible: ${insumo.stock}, Solicitado: ${cantidadInt}`, 400);
            }
            nuevoStock = insumo.stock - cantidadInt;
        } else {
            nuevoStock = insumo.stock + cantidadInt;
        }

        const hayStockCritico = nuevoStock < insumo.limite_seguridad;
        const estadoAnterior = insumo.estado_insumo;

        insumo.stock = nuevoStock;
        insumo.estado_insumo = hayStockCritico ? 'Stock Crítico' : 'Normal';
        insumo.fecha_actualizacion = new Date();

        const insumoActualizado = await insumoRepository.save(insumo);

        const movimiento = {
            cantidad_utilizada: cantidadInt,
            tipo_movimiento: tipoMovimientoLower,
            observaciones: observaciones || null,
            insumo: { id_insumo: parseInt(id_insumo) },
            agenda: { id_servicio: parseInt(id_servicio) },
        };

        const movimientoRegistrado = await consumoInsumoRepository.save(movimiento);

        const respuesta = {
            movimiento: {
                id_consumo: movimientoRegistrado.id_consumo,
                tipo: tipoMovimientoLower,
                cantidad: cantidadInt,
                fecha: movimientoRegistrado.fecha_emision || new Date(),
            },
            insumo: {
                id_insumo: insumoActualizado.id_insumo,
                nombre: insumoActualizado.nombre_insumo,
                stock_anterior: insumo.stock + (tipoMovimientoLower === 'salida' ? cantidadInt : -cantidadInt),
                stock_nuevo: insumoActualizado.stock,
                limite_seguridad: insumoActualizado.limite_seguridad,
                estado: insumoActualizado.estado_insumo,
            },
            alertaVisual: hayStockCritico,
            cambio_estado: estadoAnterior !== insumoActualizado.estado_insumo,
            detalle_alerta: hayStockCritico ? {
                tipo: 'STOCK_CRITICO',
                titulo: 'Alerta de Stock Crítico',
                descripcion: `El insumo "${insumoActualizado.nombre_insumo}" ha alcanzado el nivel crítico. Stock actual: ${nuevoStock}`,
                icono: 'warning',
                prioridad: 'alta',
            } : null,
        };

        return sendSuccess(res, respuesta, `Movimiento de ${tipoMovimientoLower} registrado exitosamente`, 201);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al registrar el movimiento de insumo', 500);
    }

};

/**
 * get /insumos/alertas
 * Obtiene todos los insumos en estado Crítico
 */
const obtenerInsumosEnAlerta = async (req, res) => {
    try {
        const insumoRepository = getRepository('Insumo');
        const insumosEnAlerta = await insumoRepository.find({
            where: { estado_insumo: 'Stock Crítico' },
            order: { fecha_actualizacion: 'DESC' },
        });
        return sendSuccess(res, insumosEnAlerta, "Insumos en alerta obtenidos correctamente");
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener insumos en alerta', 500);
    }
};
/**
 * GET /insumos/:id_insumo/historico
 * Obtiene el histórico de movimientos de un insumo específico
 */
const obtenerHistoricoMovimientos = async (req, res) => {
    try {
        const { id_insumo } = req.params;

        if (!id_insumo) {
            return sendError(res, 'ID de insumo requerido', 400);
        }

        const consumoInsumoRepository = getRepository('ConsumoInsumo');

        const movimientos = await consumoInsumoRepository.find({
            where: { insumo: { id_insumo: parseInt(id_insumo) } },
            relations: ['insumo', 'agenda'],
            order: { fecha_emision: 'DESC' },
        });

        return sendSuccess(
            res, 
            {
                id_insumo: parseInt(id_insumo),
                cantidad_movimientos: movimientos.length,
                movimientos: movimientos,
            },
            'Histórico de movimientos obtenido correctamente'
        );
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