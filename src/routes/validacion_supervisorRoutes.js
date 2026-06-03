/**
 * Rutas de tarea
 * Aquí definimos los endpoints relacionados con tarea
 */

const express = require('express');
const router = express.Router();
const validacion_supervisorController = require('../controllers/validacion_supervisorController');

// POST /validacion_supervisor - Crear una nueva validacion de supervisor

router.post('/', validacion_supervisorController.crearValidacion_supervisor);

// GET /validacion_supervisor - Obtener todas las validaciones de supervisor

router.get('/', validacion_supervisorController.obtenerTodosLasValidaciones_supervisor);

//GET /validacion_supervisor/:id - Obtener una validacion de supervisor específica

router.get('/:id_validacion_supervisor', validacion_supervisorController.obtenerValidacion_supervisorPorId);

// PATCH /validacion_supervisor/:id - Actualizar una validacion de supervisor

router.patch('/:id_validacion_supervisor', validacion_supervisorController.actualizarValidacion_supervisor);

// DELETE /validacion_supervisor/:id - Eliminar una validacion de supervisor

router.delete('/:id_validacion_supervisor', validacion_supervisorController.eliminarValidacion_supervisor);

module.exports = router;
