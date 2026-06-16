/**
 * Rutas de asistencia
 * Aquí definimos los endpoints relacionados con la asistencia
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /asistencia - Crear un nuevo registro de asistencia (IMPLEMENTADO)
// Requiere: Administrador, Coordinador o Supervisor
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.crearAsistencia);

// GET /asistencia - Obtener todos los registros de asistencia
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, asistenciaController.obtenerTodasLasAsistencia);

//GET /asistencia/:id - Obtener un registro de asistencia específico
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_asistencia', autenticacion, asistenciaController.obtenerAsistenciaPorId);

// PATCH /asistencia/:id - Actualizar un registro de asistencia
// Requiere: Administrador, Coordinador o Supervisor
router.patch('/:id_asistencia', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.actualizarAsistencia);

// DELETE /asistencia/:id - Eliminar un registro de asistencia
// Requiere: Administrador, Coordinador o Supervisor
router.delete('/:id_asistencia', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.eliminarAsistencia);

module.exports = router;
