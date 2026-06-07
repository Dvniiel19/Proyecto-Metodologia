/**
 * Rutas de tarea
 * Aquí definimos los endpoints relacionados con tarea
 */

const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

// POST /tarea - Crear una nueva tarea

router.post('/', tareaController.crearTarea);

// GET /tarea - Obtener todas las tareas

router.get('/', tareaController.obtenerTodasLasTarea);

//GET /tarea/:id - Obtener una tarea específico

router.get('/:id_tarea', tareaController.obtenerTareaPorId);

// PATCH /tarea/:id - Actualizar una tarea

router.patch('/:id_tarea', tareaController.actualizarTarea);

// DELETE /tarea/:id - Eliminar una tarea

router.delete('/:id_tarea', tareaController.eliminarTarea);

module.exports = router;
