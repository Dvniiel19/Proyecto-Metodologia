/**
 * Rutas de consumo_insumo
 * Aquí definimos los endpoints relacionados con consumo_insumos
 */

const express = require('express');
const router = express.Router();
const consumoInsumoController = require('../controllers/consumoInsumoController');

// POST /consumo_insumo - Crear un nuevo consumo_insumo 

router.post('/', consumoInsumoController.crearConsumoInsumo);

// GET /consumo_insumo - Obtener todos los consumo_insumos

router.get('/', consumoInsumoController.obtenerTodosLosConsumoInsumo);

//GET /consumo_insumo/:id - Obtener un consumo_insumo específico

router.get('/:id_consumo', consumoInsumoController.obtenerConsumoInsumoPorId);

// PATCH /consumo_insumo/:id - Actualizar un consumo_insumo

router.patch('/:id_consumo', consumoInsumoController.actualizarConsumoInsumo);

// DELETE /consumo_insumo/:id - Eliminar un consumo_insumo

router.delete('/:id_consumo', consumoInsumoController.eliminarConsumoInsumo);

module.exports = router;
