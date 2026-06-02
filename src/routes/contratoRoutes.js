/**
 * Rutas de contrato
 * Aquí definimos los endpoints relacionados con contratos
 */

const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');

// POST /contrato - Crear un nuevo contrato
router.post('/', contratoController.crearContrato);

// GET /contrato - Obtener todos los contratos
router.get('/', contratoController.obtenerTodosLosContrato);

//GET /contrato/:id - Obtener un contrato específico
router.get('/:id_contrato', contratoController.obtenerContratoPorId);

// PATCH /contrato/:id - Actualizar un contrato
router.patch('/:id_contrato', contratoController.actualizarContrato);

// DELETE /contrato/:id - Eliminar un contrato
router.delete('/:id_contrato', contratoController.eliminarContrato);

module.exports = router;
