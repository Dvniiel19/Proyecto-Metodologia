/**
 * Rutas de Usuarios
 * Aquí definimos los endpoints relacionados con usuarios
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// POST /usuario - Crear un nuevo usuario (IMPLEMENTADO)
router.post('/', usuarioController.crearUsuario);

// GET /usuario - Obtener todos los usuarios
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', usuarioController.obtenerTodosLosUsuarios);

//GET /usuario/:id - Obtener un usuario específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_usuario', usuarioController.obtenerUsuarioPorId);

// PATCH /usuario/:id - Actualizar un usuario
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_usuario', usuarioController.actualizarUsuario);

// DELETE /usuario/:id - Eliminar un usuario
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_usuario', usuarioController.eliminarUsuario);

module.exports = router;
