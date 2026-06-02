/**
 * Rutas de agenda
 * Aquí definimos los endpoints relacionados con la agenda
 */

const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// POST /agenda - Crear un nuevo evento en la agenda (IMPLEMENTADO)
router.post('/', agendaController.crearAgenda);

// GET /agenda - Obtener todos los eventos en la agenda
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/', agendaController.obtenerTodosLosAgenda);

//GET /agenda/:id - Obtener un evento específico
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.get('/:id_agenda', agendaController.obtenerAgendaPorId);

// PATCH /agenda/:id - Actualizar un evento
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.patch('/:id_agenda', agendaController.actualizarAgenda);

// DELETE /agenda/:id - Eliminar un evento
// TODO: Descomenta la siguiente línea cuando implementes la función en el controlador
router.delete('/:id_agenda', agendaController.eliminarAgenda);

module.exports = router;
