/**
 * Rutas de tarea
 * Aquí definimos los endpoints relacionados con tarea
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { subirFotoEvidencia } = require('../middlewares/evidenciaUploadMiddleware');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /tarea - Crear una nueva tarea
// Requiere: Administrador o Coordinador
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.crearTarea);

// GET /tarea - Obtener todas las tareas
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, tareaController.obtenerTodasLasTarea);

//GET /tarea/:id - Obtener una tarea específico
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_tarea', autenticacion, tareaController.obtenerTareaPorId);

// PATCH /tarea/:id - Actualizar una tarea
// Requiere: Administrador o Coordinador
router.patch('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.actualizarTarea);

// DELETE /tarea/:id - Eliminar una tarea
// Requiere: Administrador o Coordinador
router.delete('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.eliminarTarea);

module.exports = router;
