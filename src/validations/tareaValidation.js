"use strict";

const Joi = require('joi');

/**
 * validacion para crear una Tarea (req.body)
 * POST /tarea
 */
const createTareaSchema = Joi.object({
    descripcion: Joi.string()
        .min(3) 
        .max(255) 
        .required() 
        .messages({
            'string.base': 'La descripción debe ser un texto.',
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 3 caracteres.',
            'string.max': 'La descripción no puede exceder los 255 caracteres.',
            'any.required': 'La descripción es un campo obligatorio.'
        })
});

/**
 * validacion para actualizar una Tarea (req.body)
 * PATCH /tarea/:id
 */
const updateTareaSchema = Joi.object({
    descripcion: Joi.string()
        .min(3) 
        .max(255) 
        .required() 
        .messages({
            'string.base': 'La descripción debe ser un texto.',
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 3 caracteres.',
            'string.max': 'La descripción no puede exceder los 255 caracteres.',
            'any.required': 'La descripción es un campo obligatorio.'
        })
});

module.exports = {
    createTareaSchema,
    updateTareaSchema
};