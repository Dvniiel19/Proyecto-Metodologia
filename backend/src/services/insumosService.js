const db = require('../config/db');
const Insumos = require('../entities/insumos.entity');
const { notificarStockCritico } = require('./emailService');

const insumosRepository = db.getRepository(Insumos);

// Unica fuente de verdad de la regla de negocio "stock critico": al llegar al limite (<=)
// el insumo pasa a 'Stock Critico' (sin tilde, igual que en la validacion Joi y en el
// filtro de /insumos/alertas). La usan actualizarInsumo y registrarMovimientoInsumo.
const calcularEstadoInsumo = (stock, limite_seguridad) =>
    stock <= limite_seguridad ? 'Stock Critico' : 'Normal';

/**
 * crear un nuevo insumo
 * @param {Object} datosInsumos 
 * @return {Object} 
*/

const crearInsumos = async (datosInsumos) => {
    const nuevoInsumo = insumosRepository.create(datosInsumos);
    return await insumosRepository.save(nuevoInsumo);
};

/**
 * obtener todos los insumos
 * @return {Array}
 */

const obtenerTodosLosInsumos = async () => {
    return await insumosRepository.find();
};

/**
 * obtener insumo por id
 * @param {Number} id_insumo 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerInsumoPorId = async (id_insumo) => {
    return await insumosRepository.findOneBy({id_insumo});
};

/**
 * actualizar un insumo existente
 * @param {Number} id_insumo
 * @param {Object} datosActualizados
 * @returns {Object | null} 
 */
const actualizarInsumo = async (id_insumo, datosActualizados) => {
    // 1. Buscamos el insumo actual en Supabase para conocer sus valores guardados
    const insumo = await obtenerInsumoPorId(id_insumo);
    if (!insumo) return null;

    // 2. Si la peticion actualiza el stock, recalculamos el estado automaticamente
    if (datosActualizados.stock !== undefined) {
        const nuevoStock = parseInt(datosActualizados.stock);
        datosActualizados.estado_insumo = calcularEstadoInsumo(nuevoStock, insumo.limite_seguridad);
    }

    // 3. Agregamos la fecha de actualizacion de manera manual
    datosActualizados.fecha_actualizacion = new Date();

    // 4. Guardamos los cambios corregidos en la base de datos
    await insumosRepository.update(id_insumo, datosActualizados);
    
    // 5. Retornamos el insumo con los datos nuevos ya calculados
    return await obtenerInsumoPorId(id_insumo);
};

/**
 * eliminar un insumo
 * @param {Number} id_insumo 
 * @return {Boolean} 
 */

const eliminarInsumo = async (id_insumo) => {
    const result = await insumosRepository.delete(id_insumo);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

/**
 * registrar movimiento de insumo (ingreso/salida)
 * @param {Number} id_insumo
 * @param {Number} cantidad
 * @param {String} tipo_movimiento
 * @param {Number} id_servicio
 * @param {String} observaciones
 * @returns {Object}
 */

// Registra un ingreso o salida de stock. Los errores de negocio llevan statusCode
// (404 no existe / 400 stock insuficiente) para que el controller responda el
// codigo HTTP correcto sin depender del texto del mensaje.
const registrarMovimientoInsumo = async (id_insumo, cantidad, tipo_movimiento, id_servicio, observaciones) => {
    const consumoInsumoRepository = db.getRepository('ConsumoInsumo');

    // 1. Buscar el insumo (parseInt porque el id puede llegar como string)
    const insumo = await insumosRepository.findOneBy({ id_insumo: parseInt(id_insumo) });
    if (!insumo) {
        const error = new Error(`Insumo con ID ${id_insumo} no encontrado`);
        error.statusCode = 404;
        throw error;
    }

    let nuevoStock;
    const tipoMovimientoLower = tipo_movimiento.toLowerCase();

    // 2. Calcular el stock nuevo segun el tipo de movimiento.
    // Regla de negocio: una salida nunca puede dejar el stock en negativo
    if (tipoMovimientoLower === 'salida') {
        if (cantidad > insumo.stock) {
            const error = new Error(`Stock insuficiente. Disponible: ${insumo.stock}, Solicitado: ${cantidad}`);
            error.statusCode = 400;
            throw error;
        }
        nuevoStock = insumo.stock - cantidad;
    } else {
        nuevoStock = insumo.stock + cantidad;
    }

    const estadoAnterior = insumo.estado_insumo;
    const nuevoEstado = calcularEstadoInsumo(nuevoStock, insumo.limite_seguridad);
    const hayStockCritico = nuevoEstado === 'Stock Critico';

    insumo.stock = nuevoStock;
    insumo.estado_insumo = nuevoEstado;
    insumo.fecha_actualizacion = new Date();

    const insumoActualizado = await insumosRepository.save(insumo);

    // Alerta proactiva: ademas de dejar el estado en BD, se dispara una notificacion
    // activa. Si el canal de alerta falla no se revierte el movimiento de stock
    // (el registro contable manda), solo se deja constancia en el log.
    if (hayStockCritico) {
        try {
            await notificarStockCritico(insumoActualizado);
        } catch (alertaError) {
            console.warn('No se pudo enviar la alerta de stock critico:', alertaError.message);
        }
    }

    // 3. Dejar el movimiento registrado en el historico (tabla consumo_insumo),
    // enlazado al insumo y a la jornada (agenda) donde se uso
    const movimiento = {
        cantidad_utilizada: cantidad,
        tipo_movimiento: tipoMovimientoLower,
        observaciones: observaciones || null,
        insumo: { id_insumo: parseInt(id_insumo) },
        agenda: { id_servicio: parseInt(id_servicio) },
    };

    const movimientoRegistrado = await consumoInsumoRepository.save(movimiento);

    // 4. Respuesta estructurada: incluye el detalle del movimiento, el estado del
    // insumo y una alerta lista para que el frontend la muestre si el stock quedo critico
    return {
        movimiento: {
            id_consumo: movimientoRegistrado.id_consumo,
            tipo: tipoMovimientoLower,
            cantidad: cantidad,
            fecha: movimientoRegistrado.fecha_emision || new Date(),
        },
        insumo: {
            id_insumo: insumoActualizado.id_insumo,
            nombre: insumoActualizado.nombre_insumo,
            stock_anterior: insumo.stock + (tipoMovimientoLower === 'salida' ? cantidad : -cantidad),
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
};

/**
 * obtener insumos en alerta
 * @return {Array}
 */

const obtenerInsumosEnAlerta = async () => {
    return await insumosRepository.find({
        where: { estado_insumo: 'Stock Critico' },
        order: { fecha_actualizacion: 'DESC' },
    });
};

/**
 * obtener historico de movimientos de un insumo
 * @param {Number} id_insumo
 * @returns {Object}
 */

const obtenerHistoricoMovimientos = async (id_insumo) => {
    const consumoInsumoRepository = db.getRepository('ConsumoInsumo');
    const movimientos = await consumoInsumoRepository.find({
        where: { insumo: { id_insumo: parseInt(id_insumo) } },
        relations: ['insumo', 'agenda'],
        order: { fecha_emision: 'DESC' },
    });
    return {
        id_insumo: parseInt(id_insumo),
        cantidad_movimientos: movimientos.length,
        movimientos: movimientos,
    };
};

module.exports = {
    crearInsumos,
    obtenerTodosLosInsumos,
    obtenerInsumoPorId,
    actualizarInsumo,
    eliminarInsumo,
    registrarMovimientoInsumo,
    obtenerInsumosEnAlerta,
    obtenerHistoricoMovimientos,
};