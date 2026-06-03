/**
 * Validaciones para Insumos
 * Define las reglas para crear y actualizar el inventario
 */

const Joi = require('joi');

// Esquema para crear un nuevo insumo (POST)
const createInsumoSchema = Joi.object({
    nombre_insumo: Joi.string()
        .trim() // Elimina espacios en blanco al inicio y al final
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.base': 'El nombre del insumo debe ser un texto.',
            'string.empty': 'El nombre del insumo no puede estar vacío.',
            'string.min': 'El nombre del insumo debe tener al menos 2 caracteres.',
            'string.max': 'El nombre del insumo no puede exceder los 255 caracteres.',
            'any.required': 'El nombre del insumo es obligatorio.'
        }),

    stock: Joi.number()
        .integer()
        .min(0) // Validamos que el stock no sea un número negativo
        .required()
        .messages({
            'number.base': 'El stock debe ser un número.',
            'number.integer': 'El stock debe ser un número entero.',
            'number.min': 'El stock no puede ser negativo.',
            'any.required': 'El stock es un campo obligatorio.'
        })
});

