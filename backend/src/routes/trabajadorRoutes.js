/**
 * Rutas de trabajadores
 * Aqui definimos los endpoints relacionados con trabajadores
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const trabajadorController = require('../controllers/trabajadorController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /trabajador - Crear un nuevo trabajador (PROTEGIDA - Administrador o Coordinador)
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), trabajadorController.crearTrabajador);

// GET /trabajador - Obtener todos los trabajadores (PROTEGIDA - Autenticado)
router.get('/', autenticacion, trabajadorController.obtenerTodosLosTrabajador);

//GET /trabajador/:id - Obtener un trabajador especifico (PROTEGIDA - Autenticado)
router.get('/:id_trabajador', autenticacion, trabajadorController.obtenerTrabajadorPorId);

// PATCH /trabajador/:id - Actualizar un trabajador (PROTEGIDA - Administrador, Coordinador o el trabajador mismo)
router.patch('/:id_trabajador', autenticacion, trabajadorController.actualizarTrabajador);

// DELETE /trabajador/:id - Eliminar un trabajador (PROTEGIDA - Solo Administrador)
router.delete('/:id_trabajador', autenticacion, autorizacion(['Administrador']), trabajadorController.eliminarTrabajador);

module.exports = router;
