/**
 * Rutas de validación del Supervisor
 * Aquí definimos los endpoints relacionados con validaciones del Supervisor
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const validacionSupervisorController = require('../controllers/validacionSupervisorController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /validacion_Supervisor - Crear una nueva validacion de Supervisor
// Requiere: Administrador o Supervisor
router.post('/', autenticacion, autorizacion(['Administrador', 'Supervisor']), validacionSupervisorController.crearValidacionSupervisor);

// GET /validacion_Supervisor - Obtener todas las validaciones de Supervisor
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, validacionSupervisorController.obtenerTodasLasValidacioneSupervisor);

//GET /validacion_Supervisor/:id - Obtener una validacion de Supervisor específica
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_validacion', autenticacion, validacionSupervisorController.obtenerValidacionSupervisorPorId);

// PATCH /validacion_Supervisor/:id - Actualizar una validacion de Supervisor
// Requiere: Administrador o Supervisor
router.patch('/:id_validacion', autenticacion, autorizacion(['Administrador', 'Supervisor']), validacionSupervisorController.actualizarValidacionSupervisor);

// DELETE /validacion_Supervisor/:id - Eliminar una validacion de Supervisor
// Requiere: Administrador o Supervisor
router.delete('/:id_validacion', autenticacion, autorizacion(['Administrador', 'Supervisor']), validacionSupervisorController.eliminarValidacionSupervisor);

module.exports = router;
