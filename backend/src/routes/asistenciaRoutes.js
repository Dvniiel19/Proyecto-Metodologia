/**
 * Rutas de asistencia
 * Aqui definimos los endpoints relacionados con la asistencia
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const asistenciaController = require('../controllers/asistenciaController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /asistencia - Crear un nuevo registro de asistencia manualmente
// Requiere: Administrador, Coordinador o Supervisor
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.crearAsistencia);

// POST /asistencia/entrada - Reloj control: fichar entrada (hora y fecha automaticas)
// Requiere: Trabajador, Supervisor, Coordinador
router.post('/entrada', autenticacion, autorizacion(['Trabajador', 'Supervisor', 'Coordinador']), asistenciaController.registrarEntrada);

// PATCH /asistencia/:id/salida - Reloj control: fichar salida
// Requiere: Trabajador, Supervisor, Coordinador
router.patch('/:id_asistencia/salida', autenticacion, autorizacion(['Trabajador', 'Supervisor', 'Coordinador']), asistenciaController.registrarSalida);

// POST /asistencia/inasistencia - Registrar manualmente la ausencia de un trabajador
// Requiere: Administrador, Coordinador o Supervisor (el trabajador no asienta su propia ausencia)
router.post('/inasistencia', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.registrarInasistencia);

// GET /asistencia - Obtener todos los registros de asistencia
// Requiere: Autenticacion
router.get('/', autenticacion, asistenciaController.obtenerTodasLasAsistencia);

// GET /asistencia/trabajador/:id_trabajador - Obtener asistencias de un trabajador
// Requiere: Autenticacion
router.get('/trabajador/:id_trabajador', autenticacion, asistenciaController.obtenerAsistenciasPorTrabajador);

// GET /asistencia/:id - Obtener un registro de asistencia especifico
// Requiere: Autenticacion
router.get('/:id_asistencia', autenticacion, asistenciaController.obtenerAsistenciaPorId);

// PATCH /asistencia/:id - Actualizar un registro de asistencia
// Requiere: Administrador, Coordinador o Supervisor
router.patch('/:id_asistencia', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.actualizarAsistencia);

// DELETE /asistencia/:id - Eliminar un registro de asistencia
// Requiere: Administrador, Coordinador o Supervisor
router.delete('/:id_asistencia', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), asistenciaController.eliminarAsistencia);

module.exports = router;
