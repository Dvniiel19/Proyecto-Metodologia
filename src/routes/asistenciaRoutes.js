/**
 * Rutas de agenda
 * Aquí definimos los endpoints relacionados con la agenda
 */

const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

// POST /asistencia - Crear un nuevo registro de asistencia (IMPLEMENTADO)
router.post('/', asistenciaController.crearAsistencia);

// GET /asistencia - Obtener todos los registros de asistencia
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', asistenciaController.obtenerTodasLasAsistencia);

//GET /asistencia/:id - Obtener un registro de asistencia específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_asistencia', asistenciaController.obtenerAsistenciaPorId);

// PATCH /asistencia/:id - Actualizar un registro de asistencia     
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_asistencia', asistenciaController.actualizarAsistencia);

// DELETE /asistencia/:id - Eliminar un registro de asistencia
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_asistencia', asistenciaController.eliminarAsistencia);

module.exports = router;
