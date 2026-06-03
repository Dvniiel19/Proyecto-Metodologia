/**
 * Rutas de insumos
 * Aquí definimos los endpoints relacionados con insumoss
 */

const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');

// POST /insumos - Crear un nuevo insumos 

router.post('/', insumosController.crearInsumos);

// GET /insumos - Obtener todos los insumoss

router.get('/', insumosController.obtenerTodosLosInsumos);

//GET /insumos/:id - Obtener un insumos específico

router.get('/:id_insumos', insumosController.obtenerInsumosPorId);

// PATCH /insumos/:id - Actualizar un insumos

router.patch('/:id_insumos', insumosController.actualizarInsumos);

// DELETE /insumos/:id - Eliminar un insumos

router.delete('/:id_insumos', insumosController.eliminarInsumos);

module.exports = router;
