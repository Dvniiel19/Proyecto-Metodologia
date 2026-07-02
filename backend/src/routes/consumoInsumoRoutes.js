/**
 * Rutas de consumo_insumo
 * Aquí definimos los endpoints relacionados con consumo_insumos
 * Protegidas con autenticación JWT y autorización basada en roles
 */

const express = require('express');
const router = express.Router();
const consumoInsumoController = require('../controllers/consumoInsumoController');
const { autenticacion } = require('../middlewares/authentication.middleware');
const { autorizacion } = require('../middlewares/autorizacionMiddleware');

// POST /consumo_insumo - Crear un nuevo consumo_insumo
// Requiere: Administrador o GestorInventario
router.post('/', autenticacion, autorizacion(['Administrador', 'GestorInventario']), consumoInsumoController.crearConsumoInsumo);

// GET /consumo_insumo - Obtener todos los consumo_insumos
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/', autenticacion, consumoInsumoController.obtenerTodosLosConsumoInsumo);

//GET /consumo_insumo/:id - Obtener un consumo_insumo específico
// Requiere: Autenticación (acceso menos restrictivo)
router.get('/:id_consumo', autenticacion, consumoInsumoController.obtenerConsumoInsumoPorId);

// PATCH /consumo_insumo/:id - Actualizar un consumo_insumo
// Requiere: Administrador o GestorInventario
router.patch('/:id_consumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), consumoInsumoController.actualizarConsumoInsumo);

// DELETE /consumo_insumo/:id - Eliminar un consumo_insumo
// Requiere: Administrador o GestorInventario
router.delete('/:id_consumo', autenticacion, autorizacion(['Administrador', 'GestorInventario']), consumoInsumoController.eliminarConsumoInsumo);

module.exports = router;
