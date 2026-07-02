"use strict";

const Joi = require('joi');

/**
 * Validacion para crear un Consumo de Insumo (req.body)
 * POST /consumo_insumo
 */
const createValidacionSupervisorSchema = Joi.object({
    estado_aprobacion: Joi.string()
        .valid('completo', 'incompleto') 
        .required()
        .messages({
            'string.base': 'El estado de aprobación debe ser un texto.',
            'any.only': 'El estado de aprobación solo puede ser "completo" o "incompleto".',
            'any.required': 'El estado de aprobación es obligatorio.'
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
            id_servicio: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                'number.base': 'El ID del servicio debe ser un numero.',
                'number.integer': 'El ID del servicio debe ser un numero entero.',
                'number.positive': 'El ID del servicio debe ser un numero positivo.',
                'any.required': 'El ID del servicio es un campo obligatorio.'
                }),

                id_usuario: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                'number.base': 'El ID del usuario Supervisor debe ser un numero.',
                'number.integer': 'El ID del usuario Supervisor debe ser un numero entero.',
                'number.positive': 'El ID del usuario Supervisor debe ser un numero positivo.',
                'any.required': 'El ID del usuario Supervisor es un campo obligatorio.'
                })
                });

/**
 * Validacion para actualizar la validacion de Supervisor (req.body)
 * PATCH /validacion_Supervisor/:id
 */
const updateValidacionSupervisorSchema = Joi.object({ 
    estado_aprobacion: Joi.string()
        .valid('completo', 'incompleto') 
        .required()
        .messages({
            'string.base': 'El estado de aprobación debe ser un texto.',
            'any.only': 'El estado de aprobación solo puede ser "completo" o "incompleto".',
            'any.required': 'El estado de aprobación es obligatorio.'
        }),

    observaciones: Joi.string()
            .min(1)
            .max(225)
            .messages({
                'string.base': 'la observación debe ser un texto.',
                'string.empty': 'La observación no puede estar vacía.',
                'string.min': 'La observación debe tener al menos 1 caracteres.',
                'string.max': 'La observación no puede exceder los 225 caracteres.'
        }),id_servicio: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                'number.base': 'El ID del servicio debe ser un numero.',
                'number.integer': 'El ID del servicio debe ser un numero entero.',
                'number.positive': 'El ID del servicio debe ser un numero positivo.',
                'any.required': 'El ID del servicio es un campo obligatorio.'
                }),

                id_usuario: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                'number.base': 'El ID del usuario Supervisor debe ser un numero.',
                'number.integer': 'El ID del usuario Supervisor debe ser un numero entero.',
                'number.positive': 'El ID del usuario Supervisor debe ser un numero positivo.',
                'any.required': 'El ID del usuario Supervisor es un campo obligatorio.'
                })
            
}).min(1); // Exige que al menos se envie un campo para actualizar (cantidad, id_insumo o id_servicio)

module.exports = {
    createValidacionSupervisorSchema,
    updateValidacionSupervisorSchema
};