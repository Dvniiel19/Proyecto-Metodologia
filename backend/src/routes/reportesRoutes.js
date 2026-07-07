/**
 * Rutas de reportes
 * Endpoints de solo lectura para el dashboard de administracion
 */

const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// GET /reportes/rendimiento - Promedio de satisfaccion por trabajador (agregado en SQL)
// Requiere: Administrador, Coordinador o Supervisor
router.get(
    '/rendimiento',
    autenticacion,
    autorizacion(['Administrador', 'Coordinador', 'Supervisor']),
    reportesController.obtenerRendimiento
);

module.exports = router;
