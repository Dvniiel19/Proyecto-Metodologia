/**
 * Rutas de consumo_insumo
 * Aquí definimos los endpoints relacionados con consumo_insumos
 */

const express = require('express');
const router = express.Router();
const consumo_insumoController = require('../controllers/consumo_insumoController');

// POST /consumo_insumo - Crear un nuevo consumo_insumo 

router.post('/', consumo_insumoController.crearConsumo_insumo);

// GET /consumo_insumo - Obtener todos los consumo_insumos

router.get('/', consumo_insumoController.obtenerTodosLosConsumo_insumo);

//GET /consumo_insumo/:id - Obtener un consumo_insumo específico

router.get('/:id_consumo', consumo_insumoController.obtenerConsumo_insumoPorId);

// PATCH /consumo_insumo/:id - Actualizar un consumo_insumo

router.patch('/:id_consumo', consumo_insumoController.actualizarConsumo_insumo);

// DELETE /consumo_insumo/:id - Eliminar un consumo_insumo

router.delete('/:id_consumo', consumo_insumoController.eliminarConsumo_insumo);

module.exports = router;
