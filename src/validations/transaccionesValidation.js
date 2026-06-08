"use strict";

const Joi = require('joi');

/**
 * Validaciones para Transacciones
 * Aqui definimos las reglas que deben cumplir los datos
 */

const createTransaccionSchema = Joi.object({
    tipo_transaccion: Joi.string()
        .max(255)
        .required()
        .messages({
            'string.base': 'El tipo de transaccion debe ser un texto.',
            'string.empty': 'El tipo de transaccion no puede estar vacio.',
            'string.max': 'El tipo de transaccion no puede exceder los 255 caracteres.',
            'any.required': 'El tipo de transaccion es un campo obligatorio.'
        }),
    
    monto: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'El monto debe ser un numero.',
            'number.positive': 'El monto debe ser un valor positivo.',
            'number.precision': 'El monto no puede tener mas de 2 decimales.',
            'any.required': 'El monto es un campo obligatorio.'
        }),
    
    fecha_emision: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'La fecha de emision debe ser una fecha valida.',
            'date.format': 'La fecha de emision debe tener un formato valido (YYYY-MM-DD).',
            'any.required': 'La fecha de emision es un campo obligatorio.'
        }),
    
    fecha_pago: Joi.date()
        .iso()
        .allow(null, '')
        .optional()
        .messages({
            'date.base': 'La fecha de pago debe ser una fecha valida.',
            'date.format': 'La fecha de pago debe tener un formato valido (YYYY-MM-DD).'
        }),
    
    estado_pago: Joi.string()
        .max(255)
        .required()
        .messages({
            'string.base': 'El estado de pago debe ser un texto.',
            'string.empty': 'El estado de pago no puede estar vacio.',
            'string.max': 'El estado de pago no puede exceder los 255 caracteres.',
            'any.required': 'El estado de pago es un campo obligatorio.'
        }),

    id_contrato: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del contrato debe ser un numero.',
            'number.integer': 'El ID del contrato debe ser un numero entero.',
            'number.positive': 'El ID del contrato debe ser un numero positivo.',
            'any.required': 'El ID del contrato es obligatorio para asociar la transaccion.'
        })
});

const updateTransaccionSchema = Joi.object({
    tipo_transaccion: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': 'El tipo de transaccion debe ser un texto.',
            'string.empty': 'El tipo de transaccion no puede estar vacio.',
            'string.max': 'El tipo de transaccion no puede exceder los 255 caracteres.'
        }),
    
    monto: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'El monto debe ser un numero.',
            'number.positive': 'El monto debe ser un valor positivo.',
            'number.precision': 'El monto no puede tener mas de 2 decimales.'
        }),
    
    fecha_emision: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.base': 'La fecha de emision debe ser una fecha valida.',
            'date.format': 'La fecha de emision debe tener un formato valido (YYYY-MM-DD).'
        }),
    
    fecha_pago: Joi.date()
        .iso()
        .allow(null, '')
        .optional()
        .messages({
            'date.base': 'La fecha de pago debe ser una fecha valida.',
            'date.format': 'La fecha de pago debe tener un formato valido (YYYY-MM-DD).'
        }),
    
    estado_pago: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.base': 'El estado de pago debe ser un texto.',
            'string.empty': 'El estado de pago no puede estar vacio.',
            'string.max': 'El estado de pago no puede exceder los 255 caracteres.'
        }),

    id_contrato: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del contrato debe ser un numero.',
            'number.integer': 'El ID del contrato debe ser un numero entero.',
            'number.positive': 'El ID del contrato debe ser un numero positivo.'
        })
}).min(1).messages({
    'object.min': 'Debes enviar al menos un campo para actualizar.'
});

module.exports = {
    createTransaccionSchema,
    updateTransaccionSchema
};