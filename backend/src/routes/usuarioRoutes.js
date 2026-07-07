/**
 * Rutas de Usuarios
 * Aqui definimos los endpoints relacionados con usuarios
 */

const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');


// POST /usuario - Crear un nuevo usuario (PROTEGIDA - Solo Administrador)
router.post('/', autenticacion, autorizacion(['Administrador']), usuarioController.crearUsuario);

// POST /usuario/personal - Crear cuenta + perfil de personal en una transaccion
// (PROTEGIDA - Admin crea cualquier rol de personal; Coordinador solo Trabajadores)
router.post('/personal', autenticacion, autorizacion(['Administrador', 'Coordinador']), usuarioController.crearPersonal);

// GET /usuario - Obtener todos los usuarios (PROTEGIDA - Solo Administrador)
router.get('/', autenticacion, autorizacion(['Administrador']), usuarioController.obtenerTodosLosUsuarios);

//GET /usuario/:id - Obtener un usuario especifico (PROTEGIDA - Administrador o el usuario mismo)
router.get('/:id_usuario', autenticacion, usuarioController.obtenerUsuarioPorId);

// PATCH /usuario/:id - Actualizar un usuario (PROTEGIDA - Administrador o el usuario mismo)
router.patch('/:id_usuario', autenticacion, usuarioController.actualizarUsuario);

// DELETE /usuario/:id - Eliminar un usuario (PROTEGIDA - Solo Administrador)
router.delete('/:id_usuario', autenticacion, autorizacion(['Administrador']), usuarioController.eliminarUsuario);

module.exports = router;
