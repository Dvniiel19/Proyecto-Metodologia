/**
 * Rutas de asignarServicio
 * Aqui definimos los endpoints relacionados con clientes
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const asignarServicioController = require('../controllers/asignarServicioController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /asignarServicio - Crear un nuevo asignarServicio
// Requiere: Administrador o Coordinador
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), asignarServicioController.crearAsignacion);

// GET /asignarServicio - Obtener todos los asignarServicios
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/', autenticacion, asignarServicioController.obtenerTodasLasAsignaciones);

//GET /asignarServicio/:id - Obtener un asignarServicio especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_asignacion', autenticacion, asignarServicioController.obtenerAsignacionPorId);

// PATCH /asignarServicio/:id - Actualizar un asignarServicio
// Requiere: Administrador o Coordinador
router.patch('/:id_asignacion', autenticacion, autorizacion(['Administrador', 'Coordinador']), asignarServicioController.actualizarAsignacion);

// DELETE /asignarServicio/:id - Eliminar un asignarServicio
// Requiere: Administrador o Coordinador
router.delete('/:id_asignacion', autenticacion, autorizacion(['Administrador', 'Coordinador']), asignarServicioController.eliminarAsignacion);

module.exports = router;