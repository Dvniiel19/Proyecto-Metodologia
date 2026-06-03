/**
 * Rutas de establecimiento
 * Aquí definimos los endpoints relacionados con los establecimientos
 */

const express = require('express');
const router = express.Router();
const establecimientoController = require('../controllers/establecimientoController');

// POST /establecimiento - Crear un nuevo establecimiento 

router.post('/', establecimientoController.crearEstablecimiento);

// GET /establecimiento - Obtener todos los establecimientos

router.get('/', establecimientoController.obtenerTodosLosEstablecimiento);

//GET /establecimiento/:id - Obtener un establecimiento específico

router.get('/:id_establecimiento', establecimientoController.obtenerEstablecimientoPorId);

// PATCH /establecimiento/:id - Actualizar un establecimiento

router.patch('/:id_establecimiento', establecimientoController.actualizarEstablecimiento);

// DELETE /establecimiento/:id - Eliminar un establecimiento

router.delete('/:id_establecimiento', establecimientoController.eliminarEstablecimiento);

module.exports = router;