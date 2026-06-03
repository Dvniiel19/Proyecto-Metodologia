"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Evaluacion_Final (req.body)
 * POST /evaluacion_final
 */
const createevaluacion_finalSchema = Joi.object({
     nota: Joi.string()
        .min(1)
        .max(5) // Límite exacto de tu TypeORM
        .required() // Equivale a nullable: false
        .pattern(/^[1-5]$/) // valida que la nota sea de 1 a 5 estrellas.
        .messages({
            'string.base': 'La nota debe ser un texto.',
            'string.empty': 'La nota no puede estar vacía.',
            'string.min': 'La nota debe tener al menos 1 caracteres.',
            'string.max': 'La nota no puede exceder los 5 caracteres.',
            'any.required': 'La nota es un campo obligatorio.'
        }),
    
    comentario: Joi.string()
        .min(1)
        .max(225) // Límite exacto de tu TypeORM
        .required() // Equivale a nullable: false
        .messages({
            'string.base': 'El comentario debe ser un texto.',
            'string.empty': 'El comentario no puede estar vacío.',
            'string.min': 'El comentario debe tener al menos 1 caracteres.',
            'string.max': 'El comentario no puede exceder los 225 caracteres.',
            'any.required': 'El comentario es un campo obligatorio.'
        }),

    
});

/**
 * Validación para actualizar un Evaluacion_Final (req.body)
 * PATCH /evaluacion_final/:id
 */
const updateevaluacion_finalSchema = Joi.object({
    nota: Joi.string()
        .min(1)
        .max(5)
        .pattern(/^[1-5]$/) // valida que la nota sea de 1 a 5 estrellas.
 
        .messages({
            'string.base': 'La nota debe ser un texto.',
            'string.empty': 'La nota no puede estar vacía.',
            'string.min': 'La nota debe tener al menos 1 caracteres.',
            'string.max': 'La nota no puede exceder los 5 caracteres.'
        }),
    
    comentario: Joi.string()
        .min(1)
        .max(225)
        .messages({
            'string.base': 'El comentario debe ser un texto.',
            'string.empty': 'El comentario no puede estar vacío.',
            'string.min': 'El comentario debe tener al menos 1 caracteres.',
            'string.max': 'El comentario no puede exceder los 225 caracteres.'
        }),

    
}).min(1); // Exige que al menos se envíe un campo (nota, comentario o id_evaluacion) para actualizar

module.exports = {
    createevaluacion_finalSchema,
    updateevaluacion_finalSchema
};