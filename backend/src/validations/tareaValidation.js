"use strict";

const Joi = require('joi');

/**
 * validacion para crear una Tarea (req.body)
 * POST /tarea
 */
const createTareaSchema = Joi.object({
    // La descripcion ahora se registra en la asignacion de servicio;
    // se mantiene opcional aqui por compatibilidad con tareas antiguas
    descripcion: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': 'La descripción debe ser un texto.',
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 3 caracteres.',
            'string.max': 'La descripción no puede exceder los 255 caracteres.'
            }),
    id_asignacion: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'La asignación debe ser un número.',
            'number.integer': 'La asignación debe ser un número entero.',
            'number.positive': 'La asignación debe ser un número positivo.'
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
        .optional()
        .messages({
            'string.base': 'La descripción debe ser un texto.',
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 3 caracteres.',
            'string.max': 'La descripción no puede exceder los 255 caracteres.'
            }),
    id_asignacion: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'La asignación debe ser un número.',
            'number.integer': 'La asignación debe ser un número entero.',
            'number.positive': 'La asignación debe ser un número positivo.' 
        })
});

module.exports = {
    createTareaSchema,
    updateTareaSchema
};