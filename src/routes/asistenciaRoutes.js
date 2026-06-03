/**
 * Rutas de agenda
 * Aquí definimos los endpoints relacionados con la agenda
 */

const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

// POST /asistencia - Crear un nuevo registro de asistencia (IMPLEMENTADO)
router.post('/', asistenciaController.crearasistencia);

// GET /asistencia - Obtener todos los registros de asistencia
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', asistenciaController.obtenerTodosLosasistencia);

//GET /asistencia/:id - Obtener un registro de asistencia específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_asistencia', asistenciaController.obtenerasistenciaPorId);

// PATCH /asistencia/:id - Actualizar un registro de asistencia     
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_asistencia', asistenciaController.actualizarasistencia);

// DELETE /asistencia/:id - Eliminar un registro de asistencia
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_asistencia', asistenciaController.eliminarasistencia);

module.exports = router;
