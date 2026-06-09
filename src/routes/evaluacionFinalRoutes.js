/**
 * Rutas de evaluacion_final
 * Aquí definimos los endpoints relacionados con evaluacion_final
 */

const express = require('express');
const router = express.Router();
const evaluacionFinalController = require('../controllers/evaluacionFinalController');

router.use((req, res, next) => {
    req.usuario = { id_usuario: 1 };
    next();
});

// POST /evaluacion_final - Crear un nuevo evaluacion_final
router.post('/', evaluacionFinalController.crearEvaluacionFinal);

// GET /evaluacion_final - Obtener todos los evaluacion_final
router.get('/', evaluacionFinalController.obtenerTodasLasEvaluacionFinal);

//GET /evaluacion_final/:id - Obtener un evaluacion_final específico
router.get('/:id_evaluacion', evaluacionFinalController.obtenerEvaluacionFinalPorId);

// PATCH /evaluacion_final/:id - Actualizar un evaluacion_final
router.patch('/:id_evaluacion', evaluacionFinalController.actualizarEvaluacionFinal);

// DELETE /evaluacion_final/:id - Eliminar un evaluacion_final
router.delete('/:id_evaluacion', evaluacionFinalController.eliminarEvaluacionFinal);

module.exports = router;
