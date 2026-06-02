/**
 * Rutas de cliente
 * Aquí definimos los endpoints relacionados con clientes
 */

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// POST /cliente - Crear un nuevo cliente 

router.post('/', clienteController.crearCliente);

// GET /cliente - Obtener todos los clientes

router.get('/', clienteController.obtenerTodosLosCliente);

//GET /cliente/:id - Obtener un cliente específico

router.get('/:id_cliente', clienteController.obtenerClientePorId);

// PATCH /cliente/:id - Actualizar un cliente

router.patch('/:id_cliente', clienteController.actualizarCliente);

// DELETE /cliente/:id - Eliminar un cliente

router.delete('/:id_cliente', clienteController.eliminarCliente);

module.exports = router;
