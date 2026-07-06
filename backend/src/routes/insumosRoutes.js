/**
 * Rutas de insumos
 * Aqui definimos los endpoints relacionados con insumoss
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const insumosController = require('../controllers/insumosController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /insumos - crear un nuevo insumos
// Requiere: Administrador o GestorInventario
router.post('/', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.crearInsumos);

// GET /insumos - obtener todos los insumoss
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/', autenticacion, insumosController.obtenerTodosLosInsumos);

//RUTAS MOVIMIENTO Y CONTROL STOCK CRITICO

//POST /insumos/movimiento 
/* Registra ingreso o salida de stock y evalua alertas criticas
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
 * Obtiene todos los insumos en estado "Stock Critico"
 * Ideal para panel del Supervisor
 * Requiere: Autenticacion (acceso menos restrictivo)
 */
router.get('/alertas', autenticacion, insumosController.obtenerInsumosEnAlerta);

/**
 * GET /insumos/:id_insumo/historico
 * Obtiene el historico de movimientos de un insumo especifico
 * Util para auditoria y trazabilidad
 * Requiere: Autenticacion (acceso menos restrictivo)
 */
router.get('/:id_insumo/historico', autenticacion, insumosController.obtenerHistoricoMovimientos);

//GET /insumos/:id obtener un insumos especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_insumo', autenticacion, insumosController.obtenerInsumosPorId);

// PATCH /insumos/:id actualizar un insumos
// Requiere: Administrador o GestorInventario
router.patch('/:id_insumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.actualizarInsumos);

// DELETE /insumos/:id eliminar un insumos
// Requiere: Administrador o GestorInventario
router.delete('/:id_insumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), insumosController.eliminarInsumos);


module.exports = router;
