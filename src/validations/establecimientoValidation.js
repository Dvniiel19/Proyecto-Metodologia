"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Establecimiento (req.body)
 * POST /establecimiento
 */
const createEstablecimientoSchema = Joi.object({
    direccion: Joi.string()
        .min(5)
        .max(255) // Límite exacto de tu TypeORM
        .required() // Equivale a nullable: false
        .messages({
            'string.base': 'La dirección debe ser un texto.',
            'string.empty': 'La dirección no puede estar vacía.',
            'string.min': 'La dirección debe tener al menos 5 caracteres.',
            'string.max': 'La dirección no puede exceder los 255 caracteres.',
            'any.required': 'La dirección es un campo obligatorio.'
        }),
    
    tipo: Joi.string()
        .min(3)
        .max(100) // Límite exacto de tu TypeORM
        .required() // Equivale a nullable: false
        .messages({
            'string.base': 'El tipo debe ser un texto.',
            'string.empty': 'El tipo no puede estar vacío.',
            'string.min': 'El tipo debe tener al menos 3 caracteres.',
            'string.max': 'El tipo no puede exceder los 100 caracteres.',
            'any.required': 'El tipo es un campo obligatorio.'
        }),

    id_cliente: Joi.number()
        .integer()
        .positive()
        .required() // Obligatorio para poder hacer la relación TypeORM
        .messages({
            'number.base': 'El ID del cliente debe ser un número.',
            'number.integer': 'El ID del cliente debe ser un número entero.',
            'number.positive': 'El ID del cliente debe ser un número positivo.',
            'any.required': 'El ID del cliente es obligatorio para asociar el establecimiento.'
        })
});

/**
 * Validación para actualizar un Establecimiento (req.body)
 * PATCH /establecimiento/:id
 */
const updateEstablecimientoSchema = Joi.object({
    direccion: Joi.string()
        .min(5)
        .max(255)
        .messages({
            'string.base': 'La dirección debe ser un texto.',
            'string.empty': 'La dirección no puede estar vacía.',
            'string.min': 'La dirección debe tener al menos 5 caracteres.',
            'string.max': 'La dirección no puede exceder los 255 caracteres.'
        }),
    
    tipo: Joi.string()
        .min(3)
        .max(100)
        .messages({
            'string.base': 'El tipo debe ser un texto.',
            'string.empty': 'El tipo no puede estar vacío.',
            'string.min': 'El tipo debe tener al menos 3 caracteres.',
            'string.max': 'El tipo no puede exceder los 100 caracteres.'
        }),

    id_cliente: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'El ID del cliente debe ser un número.',
            'number.integer': 'El ID del cliente debe ser un número entero.',
            'number.positive': 'El ID del cliente debe ser un número positivo.'
        })
}).min(1); // Exige que al menos se envíe un campo (dirección, tipo o id_cliente) para actualizar

module.exports = {
    createEstablecimientoSchema,
    updateEstablecimientoSchema
};