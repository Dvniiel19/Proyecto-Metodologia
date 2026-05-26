/**
 * Rutas de trabajadores
 * Aquí definimos los endpoints relacionados con trabajadores
 */

const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/trabajadorController');

// POST /trabajador - Crear un nuevo trabajador (IMPLEMENTADO)
router.post('/', trabajadorController.crearTrabajador);

// GET /trabajador - Obtener todos los trabajadores
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', trabajadorController.obtenerTodosLosTrabajador);

//GET /trabajador/:id - Obtener un trabajador específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_trabajador', trabajadorController.obtenerTrabajadorPorId);

// PATCH /trabajador/:id - Actualizar un trabajador
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_trabajador', trabajadorController.actualizarTrabajador);

// DELETE /trabajador/:id - Eliminar un trabajador
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_trabajador', trabajadorController.eliminarTrabajador);

module.exports = router;
