/**
 * Rutas de evaluacion_final
 * Aqui definimos los endpoints relacionados con evaluacion_final
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const evaluacionFinalController = require('../controllers/evaluacionFinalController');
const { autenticacion } = require('../middlewares/authentication.middleware');

// POST /evaluacion_final - Crear un nuevo evaluacion_final (PROTEGIDA CON AUTENTICACION)
router.post('/', autenticacion, evaluacionFinalController.crearEvaluacionFinal);

// GET /evaluacion_final - Obtener todos los evaluacion_final (PROTEGIDA CON AUTENTICACION)
router.get('/', autenticacion, evaluacionFinalController.obtenerTodasLasEvaluacionFinal);

//GET /evaluacion_final/:id - Obtener un evaluacion_final especifico (PROTEGIDA CON AUTENTICACION)
router.get('/:id_evaluacion', autenticacion, evaluacionFinalController.obtenerEvaluacionFinalPorId);

// PATCH /evaluacion_final/:id - Actualizar un evaluacion_final (PROTEGIDA CON AUTENTICACION)
router.patch('/:id_evaluacion', autenticacion, evaluacionFinalController.actualizarEvaluacionFinal);

// DELETE /evaluacion_final/:id - Eliminar un evaluacion_final (PROTEGIDA CON AUTENTICACION)
router.delete('/:id_evaluacion', autenticacion, evaluacionFinalController.eliminarEvaluacionFinal);

module.exports = router;
