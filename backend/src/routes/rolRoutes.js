/**
 * Rutas de Roles
 * Aqui definimos los endpoints relacionados con roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const rolController = require('../controllers/rolController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /rol - Crear un nuevo rol (PROTEGIDA - Solo Administrador)
router.post('/', autenticacion, autorizacion(['Administrador']), rolController.crearRol);

// GET /rol - Obtener todos los roles (PROTEGIDA - Autenticado)
router.get('/', autenticacion, rolController.obtenerTodosLosRol);

//GET /rol/:id - Obtener un rol especifico (PROTEGIDA - Autenticado)
router.get('/:id_rol', autenticacion, rolController.obtenerRolPorId);

// PATCH /rol/:id - Actualizar un rol (PROTEGIDA - Solo Administrador)
router.patch('/:id_rol', autenticacion, autorizacion(['Administrador']), rolController.actualizarRol);

// DELETE /rol/:id - Eliminar un rol (PROTEGIDA - Solo Administrador)
router.delete('/:id_rol', autenticacion, autorizacion(['Administrador']), rolController.eliminarRol);

module.exports = router;
