"use strict";

const Joi = require('joi');

/**
 * Validación para crear un Consumo de Insumo (req.body)
 * POST /consumo_insumo
 */
const createValidacionSupervisorSchema = Joi.object({
    estado_aprobacion: Joi.string()
        .valid('completo', 'incompleto') // 👈 Aquí restringimos las opciones
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
});

/**
 * Validación para actualizar la validacion de supervisor (req.body)
 * PATCH /validacion_supervisor/:id
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
        }),
}).min(1); // Exige que al menos se envíe un campo para actualizar (cantidad, id_insumo o id_servicio)

module.exports = {
    createValidacionSupervisorSchema,
    updateValidacionSupervisorSchema
};