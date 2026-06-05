"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Consumo de Insumo (req.body)
 * POST /consumo_insumo
 */
const createValidacionSupervisorSchema = Joi.object({
   id_validacion: Joi.number()
        .integer()
        .positive() // Exige que el consumo sea mayor a 0
        .required() // Equivale a tu nullable: false
        .messages({
            'number.base': 'el ID de la validación debe ser un número.',
            'number.integer': 'el ID de la validación debe ser un número entero.',
            'number.positive': 'el ID de la validación debe ser un número positivo.',
            'any.required': 'el ID de la validación es un campo obligatorio.'
        }),
        
    estado_aprobacion: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'El campo "estado_aprobacion" debe ser un valor verdadero o falso (true/false).',
            'any.required': 'El campo "estado_aprobacion" es obligatorio.'
        }),

    observaciones: Joi.string()
            .min(1)
            .max(225)
            .messages({
                'string.base': 'la observación debe ser un texto.',
                'string.empty': 'La observación no puede estar vacía.',
                'string.min': 'La observación debe tener al menos 1 caracteres.',
                'string.max': 'La observación no puede exceder los 225 caracteres.'
            }),
});

/**
 * Validación para actualizar la validacion de supervisor (req.body)
 * PATCH /validacion_supervisor/:id
 */
const updateValidacionSupervisorSchema = Joi.object({
    id_validacion: Joi.number()
        .integer()
        .positive() // Exige que el consumo sea mayor a 0
        .required() // Equivale a tu nullable: false
        .messages({
            'number.base': 'el ID de la validación debe ser un número.',
            'number.integer': 'el ID de la validación debe ser un número entero.',
            'number.positive': 'el ID de la validación debe ser un número positivo.',
            'any.required': 'el ID de la validación es un campo obligatorio.'
        }),
        
    estado_aprobacion: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'El campo "estado_aprobacion" debe ser un valor verdadero o falso (true/false).',
            'any.required': 'El campo "estado_aprobacion" es obligatorio.'
        }),

    observaciones: Joi.string()
            .min(1)
            .max(225)
            .messages({
                'string.base': 'la observación debe ser un texto.',
                'string.empty': 'La observación no puede estar vacía.',
                'string.min': 'La observación debe tener al menos 1 caracteres.',
                'string.max': 'La observación no puede exceder los 225 caracteres.'
            }),
   

}).min(1); // Exige que al menos se envíe un campo para actualizar (cantidad, id_insumo o id_servicio)

module.exports = {
    createValidacionSupervisorSchema,
    updateValidacionSupervisorSchema
};