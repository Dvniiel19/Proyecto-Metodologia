/**
 * Rutas de asignarServicio
 * Aquí definimos los endpoints relacionados con clientes
 */

const express = require('express');
const router = express.Router();
const asignarServicioController = require('../controllers/asignarServicioController');

// POST /asignarServicio - Crear un nuevo asignarServicio

router.post('/', asignarServicioController.crearAsignacion);

// GET /asignarServicio - Obtener todos los asignarServicios

router.get('/', asignarServicioController.obtenerTodasLasAsignaciones);

//GET /asignarServicio/:id - Obtener un asignarServicio específico

router.get('/:id_asignacion', asignarServicioController.obtenerAsignacionPorId);

// PATCH /asignarServicio/:id - Actualizar un asignarServicio

router.patch('/:id_asignacion', asignarServicioController.actualizarAsignacion);

// DELETE /asignarServicio/:id - Eliminar un asignarServicio

router.delete('/:id_asignacion', asignarServicioController.eliminarAsignacion);

module.exports = router;