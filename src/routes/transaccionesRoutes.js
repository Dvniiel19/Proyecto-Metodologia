/**
 * Rutas de Transacciones
 * Aquí definimos los endpoints relacionados con transacciones
 */

const express = require('express');
const router = express.Router();
// Cambiado para apuntar al controlador de transacciones
const transaccionesController = require('../controllers/transaccionesController');

// POST /transacciones - Crear un nuevo rol (IMPLEMENTADO)
router.post('/', transaccionesController.crearTransaccion);

// GET /transacciones - Obtener todas las transacciones
router.get('/', transaccionesController.obtenerTodasLasTransacciones);

// GET /transacciones/:id - Obtener una transacción específica
router.get('/:id_transaccion', transaccionesController.obtenerTransaccionPorId);

// PATCH /transacciones/:id - Actualizar una transacción
router.patch('/:id_transaccion', transaccionesController.actualizarTransaccion);

// DELETE /transacciones/:id - Eliminar una transacción
router.delete('/:id_transaccion', transaccionesController.eliminarTransaccion);

module.exports = router;