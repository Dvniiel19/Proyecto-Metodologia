/**
 * Rutas de insumos
 * Aquí definimos los endpoints relacionados con insumoss
 */

const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');

// POST /insumos  crear un nuevo insumos 

router.post('/', insumosController.crearInsumos);

// GET /insumos  obtener todos los insumoss

router.get('/', insumosController.obtenerTodosLosInsumos);

//RUTAS MOVIMIENTO Y CONTROL STOCK CRITICO

//POST / insumos /movimiento 
/* Registra ingreso o salida de stock y evalúa alertas críticas
 * 
 * Body esperado:
 * {
 *   "id_insumo": 1,
 *   "cantidad": 50,
 *   "tipo_movimiento": "ingreso",
 *   "id_servicio": 5,
 *   "observaciones": "Compra a distribuidor"
 * }
 */

router.post('/movimiento',insumosController.registrarMovimientoInsumo);
/**
  //GET /insumos/alertas
 * Obtiene todos los insumos en estado "Stock Crítico"
 * Ideal para panel del supervisor
 */
router.get('/alertas',insumosController.obtenerInsumosEnAlerta);

/**
 * GET /insumos/:id_insumo/historico
 * Obtiene el histórico de movimientos de un insumo específico
 * Útil para auditoría y trazabilidad
 */
router.get('/:id_insumo/historico', insumosController.obtenerHistoricoMovimientos);

//GET /insumos/:id obtener un insumos específico

router.get('/:id_insumo', insumosController.obtenerInsumosPorId);

// PATCH /insumos/:id actualizar un insumos

router.patch('/:id_insumo', insumosController.actualizarInsumos);

// DELETE /insumos/:id eliminar un insumos

router.delete('/:id_insumo', insumosController.eliminarInsumos);


module.exports = router;
