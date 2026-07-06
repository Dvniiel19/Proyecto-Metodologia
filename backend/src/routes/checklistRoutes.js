/**
 * Rutas de checklist
 * Aqui definimos los endpoints relacionados con checklist
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const checklistController = require('../controllers/checklistController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /checklist - Crear un nuevo checklist
// Requiere: Administrador, Coordinador o Supervisor
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.crearChecklist);

// GET /checklist - Obtener todos los checklists
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/', autenticacion, checklistController.obtenerTodosLosChecklist);

//GET /checklist/:id - Obtener un checklist especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_checklist', autenticacion, checklistController.obtenerChecklistPorId);

// PATCH /checklist/:id - Actualizar un checklist
// Requiere: Administrador, Coordinador o Supervisor
router.patch('/:id_checklist', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.actualizarChecklist);

// DELETE /checklist/:id - Eliminar un checklist
// Requiere: Administrador, Coordinador o Supervisor
router.delete('/:id_checklist', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.eliminarChecklist);

module.exports = router;
