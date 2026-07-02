/**
 * Rutas de cliente
 * Aqui definimos los endpoints relacionados con clientes
 */

const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const clienteController = require('../controllers/clienteController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /cliente - Crear un nuevo cliente (PROTEGIDA - Administrador o Coordinador)
router.post('/', autenticacion, autorizacion(['Administrador', 'Coordinador']), clienteController.crearCliente);

// GET /cliente - Obtener todos los clientes (PROTEGIDA - Autenticado)
router.get('/', autenticacion, clienteController.obtenerTodosLosCliente);

//GET /cliente/:id - Obtener un cliente especifico (PROTEGIDA - Autenticado)
router.get('/:id_cliente', autenticacion, clienteController.obtenerClientePorId);

// PATCH /cliente/:id - Actualizar un cliente (PROTEGIDA - Administrador, Coordinador o el cliente mismo)
router.patch('/:id_cliente', autenticacion, clienteController.actualizarCliente);

// DELETE /cliente/:id - Eliminar un cliente (PROTEGIDA - Solo Administrador)
router.delete('/:id_cliente', autenticacion, autorizacion(['Administrador']), clienteController.eliminarCliente);

module.exports = router;
