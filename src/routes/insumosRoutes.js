/**
 * Rutas de insumos
 * Aquí definimos los endpoints relacionados con insumoss
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /insumos - crear un nuevo insumos
// Requiere: Administrador o GestorInventario
router.post('/', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.crearInsumos);

// GET /insumos - obtener todos los insumoss
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, insumosController.obtenerTodosLosInsumos);

//RUTAS MOVIMIENTO Y CONTROL STOCK CRITICO

//POST /insumos/movimiento 
/* Registra ingreso o salida de stock y evalúa alertas críticas
 * Requiere: Administrador o GestorInventario
 * Body esperado:
 * {
 *   "id_insumo": 1,
 *   "cantidad": 50,
 *   "tipo_movimiento": "ingreso",
 *   "id_servicio": 5,
 *   "observaciones": "Compra a distribuidor"
 * }
 */
router.post('/movimiento', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.registrarMovimientoInsumo);

/**
 * GET /insumos/alertas
 * Obtiene todos los insumos en estado "Stock Crítico"
 * Ideal para panel del Supervisor
 * Requiere: Autenticación (acceso menos restrictivo)
 */
router.get('/alertas', autenticacion, insumosController.obtenerInsumosEnAlerta);

/**
 * GET /insumos/:id_insumo/historico
 * Obtiene el histórico de movimientos de un insumo específico
 * Útil para auditoría y trazabilidad
 * Requiere: Autenticación (acceso menos restrictivo)
 */
router.get('/:id_insumo/historico', autenticacion, insumosController.obtenerHistoricoMovimientos);

//GET /insumos/:id obtener un insumos específico
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_insumo', autenticacion, insumosController.obtenerInsumosPorId);

// PATCH /insumos/:id actualizar un insumos
// Requiere: Administrador o GestorInventario
router.patch('/:id_insumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.actualizarInsumos);

// DELETE /insumos/:id eliminar un insumos
// Requiere: Administrador o GestorInventario
router.delete('/:id_insumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.eliminarInsumos);


module.exports = router;
