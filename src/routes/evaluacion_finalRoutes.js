/**
 * Rutas de evaluacion_final
 * Aquí definimos los endpoints relacionados con evaluacion_final
 */

const express = require('express');
const router = express.Router();
const evaluacion_finalController = require('../controllers/evaluacion_finalController');
// POST /evaluacion_final - Crear un nuevo evaluacion_final
router.post('/', evaluacion_finalController.crearEvaluacion_Final);

// GET /evaluacion_final - Obtener todos los evaluacion_final
router.get('/', evaluacion_finalController.obtenerTodosLosEvaluacion_Final);

//GET /evaluacion_final/:id - Obtener un evaluacion_final específico
router.get('/:id_evaluacion_final', evaluacion_finalController.obtenerEvaluacion_FinalPorId);

// PATCH /evaluacion_final/:id - Actualizar un evaluacion_final
router.patch('/:id_evaluacion_final', evaluacion_finalController.actualizarEvaluacion_Final);

// DELETE /evaluacion_final/:id - Eliminar un evaluacion_final
router.delete('/:id_evaluacion_final', evaluacion_finalController.eliminarEvaluacion_Final);

module.exports = router;
