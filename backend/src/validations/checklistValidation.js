/**
 * Validaciones para Checklist
 * Aqui definimos las reglas que deben cumplir los datos al crear o actualizar un Checklist
 */

const Joi = require('joi');

// Esquema para crear un nuevo registro en el Checklist (POST)
const createChecklistSchema = Joi.object({
    completado: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'El campo "completado" debe ser un valor verdadero o falso (true/false).',
            'any.required': 'El campo "completado" es obligatorio.'
        }),
        
    foto_servicio: Joi.string()
        .uri() // Valida que tenga formato de URL (http://...)
        .max(2000) // Alineado con el length: 255 de tu TypeORM
        .allow(null, '') // Permite nulos ya que nullable: true en la BD
        .optional()
        .messages({
            'string.base': 'La foto debe ser un texto.',
            'string.uri': 'La foto debe ser un enlace (URL) válido.',
            'string.max': 'El enlace no puede exceder los 2000 caracteres.'
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

    id_tarea: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de la tarea debe ser un numero.',
            'number.integer': 'El ID de la tarea debe ser un numero entero.',
            'number.positive': 'El ID de la tarea debe ser un numero positivo.',
            'any.required': 'El ID de la tarea es un campo obligatorio.'
        })
});

// Esquema para actualizar un registro en el Checklist (PATCH)
const updateChecklistSchema = Joi.object({
    completado: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'El campo "completado" debe ser un valor verdadero o falso (true/false).'
        }),
        
    foto_servicio: Joi.string()
        .uri()
        .max(255)
        .allow(null, '')
        .optional()
        .messages({
            'string.base': 'La foto debe ser un texto.',
            'string.uri': 'La foto debe ser un enlace (URL) valido.',
            'string.max': 'El enlace no puede exceder los 255 caracteres.'
        }),

}).min(1).messages({
    'object.min': 'Debes enviar al menos un campo para actualizar en el checklist.'
});

module.exports = {
    createChecklistSchema,
    updateChecklistSchema
};