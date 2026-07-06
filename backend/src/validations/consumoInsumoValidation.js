"use strict";

const Joi = require('joi');

/**
 * Validacion para crear un Consumo de Insumo (req.body)
 * POST /consumo_insumo
 */
const createConsumoInsumoSchema = Joi.object({
    cantidad_utilizada: Joi.number()
        .integer()
        .positive() // Exige que el consumo sea mayor a 0
        .required() // Equivale a tu nullable: false
        .messages({
            'number.base': 'La cantidad utilizada debe ser un número.',
            'number.integer': 'La cantidad utilizada debe ser un número entero.',
            'number.positive': 'La cantidad utilizada debe ser un número positivo mayor a cero.',
            'any.required': 'La cantidad utilizada es un campo obligatorio.'
        }),
    
    id_insumo: Joi.number()
        .integer()
        .positive()
        .required() // Obligatorio para asociar el insumo en TypeORM
        .messages({
            'number.base': 'El ID del insumo debe ser un número.',
            'number.integer': 'El ID del insumo debe ser un número entero.',
            'number.positive': 'El ID del insumo debe ser un número positivo.',
            'any.required': 'El ID del insumo es obligatorio para registrar el consumo.'
        }),

    id_servicio: Joi.number()
        .integer()
        .positive()
        .required() // Obligatorio para asociar la agenda/servicio en TypeORM
        .messages({
            'number.base': 'El ID del servicio debe ser un número.',
            'number.integer': 'El ID del servicio debe ser un número entero.',
            'number.positive': 'El ID del servicio debe ser un número positivo.',
            'any.required': 'El ID del servicio es obligatorio para registrar el consumo.'
        })
});

/**
 * Validacion para actualizar un Consumo de Insumo (req.body)
 * PATCH /consumo_insumo/:id
 */
const updateConsumoInsumoSchema = Joi.object({
    cantidad_utilizada: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'La cantidad utilizada debe ser un número.',
            'number.integer': 'La cantidad utilizada debe ser un número entero.',
            'number.positive': 'La cantidad utilizada debe ser un número positivo mayor a cero.'
        }),
    
    id_insumo: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'El ID del insumo debe ser un número.',
            'number.integer': 'El ID del insumo debe ser un número entero.',
            'number.positive': 'El ID del insumo debe ser un número positivo.'
        }),

    id_servicio: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'El ID del servicio debe ser un número.',
            'number.integer': 'El ID del servicio debe ser un número entero.',
            'number.positive': 'El ID del servicio debe ser un número positivo.'
        })
}).min(1); // Exige que al menos se envie un campo para actualizar (cantidad, id_insumo o id_servicio)

module.exports = {
    createConsumoInsumoSchema,
    updateConsumoInsumoSchema
};