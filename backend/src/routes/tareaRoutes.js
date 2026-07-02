/**
 * Rutas de tarea
 * Aqui definimos los endpoints relacionados con tarea
 * Protegidas con autenticacion JWT y autorizacion basada en roles
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const tareaController = require('../controllers/tareaController');
const { subirFotoEvidencia } = require('../middlewares/evidenciaUploadMiddleware');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /tarea - Crear una nueva tarea
// Requiere: Administrador o Coordinador
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.crearTarea);

// GET /tarea - Obtener todas las tareas
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/', autenticacion, tareaController.obtenerTodasLasTarea);

//GET /tarea/:id - Obtener una tarea especifico
// Requiere: Autenticacion (acceso menos restrictivo)
router.get('/:id_tarea', autenticacion, tareaController.obtenerTareaPorId);

// PUT /tarea/:id/finalizar - Finalizar tarea con foto de evidencia obligatoria (notifica al cliente por correo)
// Requiere: Trabajador, Supervisor o Coordinador
router.put('/:id_tarea/finalizar', autenticacion, autorizacion(['Trabajador', 'Supervisor', 'Coordinador']), subirFotoEvidencia, tareaController.finalizarTarea);

// PATCH /tarea/:id - Actualizar una tarea
// Requiere: Administrador o Coordinador
router.patch('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.actualizarTarea);

// DELETE /tarea/:id - Eliminar una tarea
// Requiere: Administrador o Coordinador
router.delete('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.eliminarTarea);

module.exports = router;
