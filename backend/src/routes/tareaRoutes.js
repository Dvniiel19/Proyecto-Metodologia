const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router);
const tareaController = require('../controllers/tareaController');
const { subirFotoEvidencia } = require('../middlewares/evidenciaUploadMiddleware');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.crearTarea);

router.get('/', autenticacion, tareaController.obtenerTodasLasTarea);

router.get('/mis-tareas', autenticacion, tareaController.obtenerMisTareas);

router.get('/:id_tarea', autenticacion, tareaController.obtenerTareaPorId);

router.put(
    '/:id_tarea/finalizar',
    autenticacion,
    autorizacion(['Trabajador', 'Supervisor', 'Coordinador', 'Administrador']),
    subirFotoEvidencia,
    tareaController.finalizarTarea
);

router.patch('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.actualizarTarea);

router.delete('/:id_tarea', autenticacion, autorizacion(['Administrador', 'Coordinador']), tareaController.eliminarTarea);

module.exports = router;