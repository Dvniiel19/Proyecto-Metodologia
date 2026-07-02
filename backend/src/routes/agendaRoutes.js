/**
 * Rutas de agenda
 * Aqui definimos los endpoints relacionados con la agenda
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const agendaController = require('../controllers/agendaController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /agenda - Crear un nuevo evento en la agenda (IMPLEMENTADO)
// Requiere: Administrador o Coordinador
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), agendaController.crearAgenda);

// GET /agenda - Obtener todos los eventos en la agenda
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/', autenticacion, agendaController.obtenerTodasLasAgenda);

//GET /agenda/:id - Obtener un evento especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_agenda', autenticacion, agendaController.obtenerAgendaPorId);

// PATCH /agenda/:id - Actualizar un evento
// Requiere: Administrador o Coordinador
router.patch('/:id_agenda', autenticacion, autorizacion(['Administrador', 'Coordinador']), agendaController.actualizarAgenda);

// DELETE /agenda/:id - Eliminar un evento
// Requiere: Administrador o Coordinador
router.delete('/:id_agenda', autenticacion, autorizacion(['Administrador', 'Coordinador']), agendaController.eliminarAgenda);

module.exports = router;
