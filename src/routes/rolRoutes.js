/**
 * Rutas de Roles
 * Aquí definimos los endpoints relacionados con roles
 */

const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /rol - Crear un nuevo rol (PROTEGIDA - Solo Administrador)
router.post('/', autenticacion, autorizacion(['Administrador']), rolController.crearRol);

// GET /rol - Obtener todos los roles (PROTEGIDA - Autenticado)
router.get('/', autenticacion, rolController.obtenerTodosLosRol);

//GET /rol/:id - Obtener un rol específico (PROTEGIDA - Autenticado)
router.get('/:id_rol', autenticacion, rolController.obtenerRolPorId);

// PATCH /rol/:id - Actualizar un rol (PROTEGIDA - Solo Administrador)
router.patch('/:id_rol', autenticacion, autorizacion(['Administrador']), rolController.actualizarRol);

// DELETE /rol/:id - Eliminar un rol (PROTEGIDA - Solo Administrador)
router.delete('/:id_rol', autenticacion, autorizacion(['Administrador']), rolController.eliminarRol);

module.exports = router;
