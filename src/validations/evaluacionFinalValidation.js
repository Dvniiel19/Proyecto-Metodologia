"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Evaluacion_Final (req.body)
 * POST /evaluacion_final
 */
const createEvaluacionFinalSchema = Joi.object({
    nota: Joi.number()
        .integer()
        .min(1)
        .max(5) // Límite exacto de tu TypeORM
        .required() // Equivale a nullable: false
        .messages({
            'number.base': 'La nota debe ser un número.',
            'number.integer': 'La nota debe ser un número entero.',
            'number.min': 'La nota mínima es 1.',
            'number.max': 'La nota no puede ser mayor a 5.',
            'any.required': 'La nota es un campo obligatorio.'
        }),
    
    comentarios: Joi.string() 
        .min(1)
        .max(255)
        .optional()
        .allow(null, '') 
        .messages({
            'string.base': 'Los comentarios deben ser un texto.',
            'string.min': 'Los comentarios deben tener al menos 1 caracter.',
            'string.max': 'Los comentarios no pueden exceder los 255 caracteres.',
        }),
        id_servicio: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del servicio debe ser un numero.',
            'number.integer': 'El ID del servicio debe ser un numero entero.',
            'number.positive': 'El ID del servicio debe ser un numero positivo.',
            'any.required': 'El ID del servicio es un campo obligatorio.'
        })
});

/**
 * Validación para actualizar un Evaluacion_Final (req.body)
 * PATCH /evaluacion_final/:id
 */
const updateEvaluacionFinalSchema = Joi.object({
    nota: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .optional() 
        .messages({
            'number.base': 'La nota debe ser un número.',
            'number.integer': 'La nota debe ser un número entero.',
            'number.min': 'La nota mínima es 1.',
            'number.max': 'La nota no puede ser mayor a 5.'
        }),
    
    comentarios: Joi.string()
        .min(1)
        .max(255)
        .optional() 
        .allow(null, '')
        .messages({
            'string.base': 'Los comentarios deben ser un texto.',
            'string.min': 'Los comentarios deben tener al menos 1 caracter.',
            'string.max': 'Los comentarios no pueden exceder los 255 caracteres.',
        }),
        //no ponemos el id_servicio porque no se puede cambiar el servicio al que esta asociada 
        //la evaluacion final. si se quisiera cambiar eso se tendria que eliminar la evaluacion
        //final y crear una nueva para el nuevo servicio
}).min(1);

module.exports = {
    createEvaluacionFinalSchema,
    updateEvaluacionFinalSchema
};