/**
 * Rutas de Roles
 * Aquí definimos los endpoints relacionados con roles
 */

const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

// POST /rol - Crear un nuevo rol (IMPLEMENTADO)
router.post('/', rolController.crearRol);

// GET /rol - Obtener todos los roles
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', rolController.obtenerTodosLosRol);

//GET /rol/:id - Obtener un rol específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_rol', rolController.obtenerRolPorId);

// PATCH /rol/:id - Actualizar un rol
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_rol', rolController.actualizarRol);

// DELETE /rol/:id - Eliminar un rol
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_rol', rolController.eliminarRol);

module.exports = router;
