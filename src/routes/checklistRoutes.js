/**
 * Rutas de checklist
 * Aquí definimos los endpoints relacionados con checklist
 */

const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistServicioController');

// POST /checklist - Crear un nuevo checklist

router.post('/', checklistController.crearChecklist);

// GET /checklist - Obtener todos los checklists

router.get('/', checklistController.obtenerTodosLosChecklist);

//GET /checklist/:id - Obtener un checklist específico

router.get('/:id_checklist', checklistController.obtenerChecklistPorId);

// PATCH /checklist/:id - Actualizar un checklist

router.patch('/:id_checklist', checklistController.actualizarChecklist);

// DELETE /checklist/:id - Eliminar un checklist

router.delete('/:id_checklist', checklistController.eliminarChecklist);

module.exports = router;
