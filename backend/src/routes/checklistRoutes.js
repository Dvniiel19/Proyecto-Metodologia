/**
 * Rutas de checklist
 * Aquí definimos los endpoints relacionados con checklist
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /checklist - Crear un nuevo checklist
// Requiere: Administrador, Coordinador o Supervisor
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.crearChecklist);

// GET /checklist - Obtener todos los checklists
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, checklistController.obtenerTodosLosChecklist);

//GET /checklist/:id - Obtener un checklist específico
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_checklist', autenticacion, checklistController.obtenerChecklistPorId);

// PATCH /checklist/:id - Actualizar un checklist
// Requiere: Administrador, Coordinador o Supervisor
router.patch('/:id_checklist', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.actualizarChecklist);

// DELETE /checklist/:id - Eliminar un checklist
// Requiere: Administrador, Coordinador o Supervisor
router.delete('/:id_checklist', autenticacion, autorizacion(['Administrador', 'Coordinador', 'Supervisor']), checklistController.eliminarChecklist);

module.exports = router;
