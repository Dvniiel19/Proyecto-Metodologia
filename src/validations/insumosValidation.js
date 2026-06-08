"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Consumo de Insumo (req.body)
 * POST /insumos
 */
const createInsumosSchema = Joi.object({
    nombre_insumo: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.base': 'El nombre del insumo debe ser un texto.',
            'string.empty': 'El nombre del insumo no puede estar vacío.',
            'string.min': 'El nombre del insumo debe tener al menos 2 caracteres.',
            'string.max': 'El nombre del insumo no puede exceder los 100 caracteres.',
            'any.required': 'El nombre del insumo es un campo obligatorio.'
        }),
    stock: Joi.number()
        .integer()
        .positive() 
        .required() 
        .messages({
            'number.base': 'La cantidad utilizada debe ser un número.',
            'number.integer': 'La cantidad utilizada debe ser un número entero.',
            'number.positive': 'La cantidad utilizada debe ser un número positivo mayor o igual a cero.',
            'any.required': 'La cantidad utilizada es un campo obligatorio.'
        }),
    

});

/**
 * Validación para actualizar un Consumo de Insumo (req.body)
 * PATCH /insumos/:id
 */
const updateInsumosSchema = Joi.object({
    nombre_insumo: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.base': 'El nombre del insumo debe ser un texto.',
            'string.empty': 'El nombre del insumo no puede estar vacío.',
            'string.min': 'El nombre del insumo debe tener al menos 2 caracteres.',
            'string.max': 'El nombre del insumo no puede exceder los 100 caracteres.'
        }),
    stock: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'La cantidad utilizada debe ser un número.',
            'number.integer': 'La cantidad utilizada debe ser un número entero.',
            'number.positive': 'La cantidad utilizada debe ser un número positivo mayor a cero.'
        }),
    
    
}).min(1); 

module.exports = {
    createInsumosSchema,
    updateInsumosSchema
};