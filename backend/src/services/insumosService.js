const db = require('../config/db');
const insumosEntity = require('../entities/insumos.entity');
const Insumos = require('../entities/insumos.entity');

const insumosRepository = db.getRepository(Insumos);

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
        const limite = insumo.limite_seguridad;

        // Si el stock actual es menor o igual al limite, pasa a Stock Critico
        datosActualizados.estado_insumo = nuevoStock <= limite ? 'Stock Critico' : 'Normal';
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

const registrarMovimientoInsumo = async (id_insumo, cantidad, tipo_movimiento, id_servicio, observaciones) => {
    const consumoInsumoRepository = db.getRepository('ConsumoInsumo');
    
    const insumo = await insumosRepository.findOneBy({ id_insumo: parseInt(id_insumo) });
    if (!insumo) {
        throw new Error(`Insumo con ID ${id_insumo} no encontrado`);
    }

    let nuevoStock;
    const tipoMovimientoLower = tipo_movimiento.toLowerCase();

    if (tipoMovimientoLower === 'salida') {
        if (cantidad > insumo.stock) {
            throw new Error(`Stock insuficiente. Disponible: ${insumo.stock}, Solicitado: ${cantidad}`);
        }
        nuevoStock = insumo.stock - cantidad;
    } else {
        nuevoStock = insumo.stock + cantidad;
    }

    const hayStockCritico = nuevoStock < insumo.limite_seguridad;
    const estadoAnterior = insumo.estado_insumo;

    insumo.stock = nuevoStock;
    insumo.estado_insumo = hayStockCritico ? 'Stock Crítico' : 'Normal';
    insumo.fecha_actualizacion = new Date();

    const insumoActualizado = await insumosRepository.save(insumo);

    const movimiento = {
        cantidad_utilizada: cantidad,
        tipo_movimiento: tipoMovimientoLower,
        observaciones: observaciones || null,
        insumo: { id_insumo: parseInt(id_insumo) },
        agenda: { id_servicio: parseInt(id_servicio) },
    };

    const movimientoRegistrado = await consumoInsumoRepository.save(movimiento);

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
        where: { estado_insumo: 'Stock Crítico' },
        order: { fecha_actualizacion: 'DESC' },
    });
};

/**
 * obtener histórico de movimientos de un insumo
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