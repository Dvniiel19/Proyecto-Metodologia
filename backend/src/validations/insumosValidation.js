"use strict";

const Joi = require('joi');

/**
 * Validacion para crear un Consumo de Insumo (req.body)
 * POST /insumos
 */
const createInsumosSchema = Joi.object({
    nombre_insumo: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.base': 'El nombre del insumo debe ser un texto.',
            'string.empty': 'El nombre del insumo no puede estar vacio.',
            'string.min': 'El nombre del insumo debe tener al menos 2 caracteres.',
            'string.max': 'El nombre del insumo no puede exceder los 100 caracteres.',
            'any.required': 'El nombre del insumo es un campo obligatorio.'
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .required() 
        .messages({
            'number.base': 'El stock debe ser un numero.',
            'number.integer': 'EL stock debe ser un numero entero.',
            'number.positive': 'EL stock debe ser un numero positivo mayor o igual a cero.',
            'any.required': 'El stock es un campo obligatorio.'
        }),

        //limite de seguridad 
    limite_seguridad:Joi.number()
    .integer()
    .min(0)
    .default(10)
    .messages({
        'number.base': 'El límite de seguridad debe ser un numero.',
        'number.integer': 'El límite de seguridad debe ser un número entero.',
        'number.min': 'El límite de seguridad no puede ser negativo.'
    }),
    
    // estado del insumo
    estado_insumo: Joi.string()
    .valid('Normal', 'Stock Critico')
    .default('Normal')
    .messages({
        'any.only': 'El estado debe ser "Normal" o "Stock Critico"',
        'string.base': 'El estado debe ser un texto.'
    }),

});

/**
 * Validacion para actualizar un Consumo de Insumo (req.body)
 * PATCH /insumos/:id
 */
const updateInsumosSchema = Joi.object({
    nombre_insumo: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.base': 'El nombre del insumo debe ser un texto.',
            'string.empty': 'El nombre del insumo no puede estar vacio.',
            'string.min': 'El nombre del insumo debe tener al menos 2 caracteres.',
            'string.max': 'El nombre del insumo no puede exceder los 100 caracteres.'
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'El stock debe ser un numero.',
            'number.integer': 'El stock debe ser un numero entero.',
            'number.positive': 'El stock debe ser un numero positivo mayor a cero.'
        }),

         //limite de seguridad 
    limite_seguridad:Joi.number()
    .integer()
    .min(0)
    .default(10)
    .messages({
        'number.base': 'El limite de seguridad debe ser un numero.',
        'number.integer': 'El límite de seguridad debe ser un numero entero.',
        'number.min': 'El límite de seguridad no puede ser negativo.'
    }),
    
    // estado del insumo
    estado_insumo: Joi.string()
    .valid('Normal', 'Stock Critico')
    .default('Normal')
    .messages({
        'any.only': 'El estado debe ser "Normal" o "Stock Critico"',
        'string.base': 'El estado debe ser un texto.'
    }),

}).min(1); 

// VALIDACION PARA REGISTRAR MOVIMIENTO DE INSUMO 
//POST /insumos /movimiento

const movimientoInsumoSchema= Joi.object({
    id_insumo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        'number.base': 'El ID del insumo debe ser un numero.',
        'number.integer': 'El ID del insumo debe ser un numero entero.',
        'number.positive': 'El ID del insumo debe ser un numero positivo.',
        'any.required': 'El ID del insumo es un campo obligatorio.'
        }),
    cantidad: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'La cantidad debe ser un numero.',
            'number.integer': 'La cantidad debe ser un numero entero.',
            'number.positive': 'La cantidad debe ser un numero positivo mayor a cero.',
            'any.required': 'La cantidad es un campo obligatorio.'
        }),
    tipo_movimiento: Joi.string()
        .valid('ingreso', 'salida')
        .required()
        .messages({
            'string.base': 'El tipo de movimiento debe ser un texto.',
            'string.empty': 'El tipo de movimiento no puede estar vacio.',
            'any.only': 'El tipo de movimiento debe ser "ingreso" o "salida".',
            'any.required': 'El tipo de movimiento es un campo obligatorio.'
        }),
    id_servicio: Joi.when('tipo_movimiento', {
     is: 'salida',
     then: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del servicio debe ser un número.',
      'number.integer': 'El ID del servicio debe ser un número entero.',
      'number.positive': 'El ID del servicio debe ser un número positivo.',
      'any.required': 'El ID del servicio es obligatorio para una salida.'
    }),
  otherwise: Joi.any()
    .allow(null, '')
    .optional()
}),
    });

module.exports = {
    createInsumosSchema,
    updateInsumosSchema,
    movimientoInsumoSchema
};