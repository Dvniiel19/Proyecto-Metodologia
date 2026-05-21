/**
 * Rutas de Usuarios
 * Aquí definimos los endpoints relacionados con usuarios
 */

const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

// POST /usuarios - Crear un nuevo usuario (IMPLEMENTADO)
router.post('/', rolController.crearRol);

// GET /usuarios - Obtener todos los usuarios
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', rolController.obtenerTodosLosRol);

//GET /usuarios/:id - Obtener un usuario específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_rol', rolController.obtenerRolPorId);

// PATCH /usuarios/:id - Actualizar un usuario
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_rol', rolController.actualizarRol);

// DELETE /usuarios/:id - Eliminar un usuario
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_rol', rolController.eliminarRol);

module.exports = router;
