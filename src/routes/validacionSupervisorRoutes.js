/**
 * Rutas de tarea
 * Aquí definimos los endpoints relacionados con tarea
 */

const express = require('express');
const router = express.Router();
const validacionSupervisorController = require('../controllers/validacionSupervisorController');

// POST /validacion_supervisor - Crear una nueva validacion de supervisor

router.post('/', validacionSupervisorController.crearValidacionSupervisor);

// GET /validacion_supervisor - Obtener todas las validaciones de supervisor

router.get('/', validacionSupervisorController.obtenerTodasLasValidacioneSupervisor);

//GET /validacion_supervisor/:id - Obtener una validacion de supervisor específica

router.get('/:id_validacion_supervisor', validacionSupervisorController.obtenerValidacionSupervisorPorId);

// PATCH /validacion_supervisor/:id - Actualizar una validacion de supervisor

router.patch('/:id_validacion_supervisor', validacionSupervisorController.actualizarValidacionSupervisor);

// DELETE /validacion_supervisor/:id - Eliminar una validacion de supervisor

router.delete('/:id_validacion_supervisor', validacionSupervisorController.eliminarValidacionSupervisor);

module.exports = router;
