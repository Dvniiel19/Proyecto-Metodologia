/**
 * Rutas de contrato
 * Aqui definimos los endpoints relacionados con contratos
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const contratoController = require('../controllers/contratoController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /contrato - Crear un nuevo contrato
// Requiere: Administrador o Coordinador
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), contratoController.crearContrato);

// GET /contrato - Obtener todos los contratos
// Requiere: Autenticacion (clientes pueden ver sus contratos)
router.get('/', autenticacion, contratoController.obtenerTodosLosContrato);

//GET /contrato/:id - Obtener un contrato especifico
// Requiere: Autenticacion (clientes pueden ver sus contratos)
router.get('/:id_contrato', autenticacion, contratoController.obtenerContratoPorId);

// PATCH /contrato/:id - Actualizar un contrato
// Requiere: Administrador o Coordinador
router.patch('/:id_contrato', autenticacion, autorizacion(['Administrador', 'Coordinador']), contratoController.actualizarContrato);

// DELETE /contrato/:id - Eliminar un contrato
// Requiere: Administrador o Coordinador
router.delete('/:id_contrato', autenticacion, autorizacion(['Administrador', 'Coordinador']), contratoController.eliminarContrato);

module.exports = router;
