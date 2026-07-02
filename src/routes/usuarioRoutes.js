/**
 * Rutas de Usuarios
 * Aquí definimos los endpoints relacionados con usuarios
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /auth/login - Autenticar usuario y obtener token (NUEVA RUTA - PUBLICA)
router.post('/auth/login', usuarioController.login);

// POST /usuario - Crear un nuevo usuario (PUBLICA - Registro)
router.post('/', usuarioController.crearUsuario);

// GET /usuario - Obtener todos los usuarios (PROTEGIDA - Solo Administrador)
router.get('/', autenticacion, autorizacion(['Administrador']), usuarioController.obtenerTodosLosUsuarios);

//GET /usuario/:id - Obtener un usuario específico (PROTEGIDA - Administrador o el usuario mismo)
router.get('/:id_usuario', autenticacion, usuarioController.obtenerUsuarioPorId);

// PATCH /usuario/:id - Actualizar un usuario (PROTEGIDA - Administrador o el usuario mismo)
router.patch('/:id_usuario', autenticacion, usuarioController.actualizarUsuario);

// DELETE /usuario/:id - Eliminar un usuario (PROTEGIDA - Solo Administrador)
router.delete('/:id_usuario', autenticacion, autorizacion(['Administrador']), usuarioController.eliminarUsuario);

module.exports = router;
