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

// GET /agenda/mis-agendas - Agendas asignadas al trabajador del usuario autenticado
// Debe registrarse ANTES de /:id_agenda para que "mis-agendas" no se interprete como un id
router.get('/mis-agendas', autenticacion, agendaController.obtenerMisAgendas);

//GET /agenda/:id - Obtener un evento especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_agenda', autenticacion, agendaController.obtenerAgendaPorId);

// PATCH /agenda/:id - Actualizar un evento
// Requiere: Administrador o Coordinador
router.patch('/:id_agenda', autenticacion, autorizacion(['Administrador', 'Coordinador','Supervisor']), agendaController.actualizarAgenda);

// PUT /agenda/:id/terminar-trabajo - Marcar el trabajo como terminado (habilita evaluacion del cliente)
// Requiere: Trabajador (solo sus servicios), Supervisor, Coordinador o Administrador
router.put(
    '/:id_agenda/terminar-trabajo',
    autenticacion,
    autorizacion(['Trabajador', 'Supervisor', 'Coordinador', 'Administrador']),
    agendaController.terminarTrabajo
);

// DELETE /agenda/:id - Eliminar un evento
// Requiere: Administrador o Coordinador
router.delete('/:id_agenda', autenticacion, autorizacion(['Administrador', 'Coordinador','Supervisor']), agendaController.eliminarAgenda);

module.exports = router;
