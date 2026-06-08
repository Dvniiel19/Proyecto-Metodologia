/**
 * Validaciones para agenda
 * Aqui definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un evento en la agenda
const createAgendaSchema = Joi.object({
  fecha_programada: Joi.date()
    .iso() // Asegura formato YYYY-MM-DD
    .required()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha valida',
      'date.format': 'La fecha programada debe tener un formato YYYY-MM-DD',
      'any.required': 'La fecha programada es un campo obligatorio'
    }),

  estado: Joi.boolean() 
    .optional()
    .messages({
      'boolean.base': 'El estado debe ser un valor verdadero o falso (true/false)'
    }),
    id_establecimiento: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del establecimiento debe ser un numero.',
            'number.integer': 'El ID del establecimiento debe ser un numero entero.',
            'number.positive': 'El ID del establecimiento debe ser un numero positivo.'
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
});

// Esquema para actualizar un evento en la agenda (PATCH)
const updateAgendaSchema = Joi.object({
  fecha_programada: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha valida',
      'date.format': 'La fecha programada debe tener un formato YYYY-MM-DD'
    }),

  estado: Joi.boolean() // Cambiado a booleano
    .optional()
    .messages({
      'boolean.base': 'El estado debe ser un valor verdadero o falso (true/false)'
    }),
    id_establecimiento: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del establecimiento debe ser un numero.',
            'number.integer': 'El ID del establecimiento debe ser un numero entero.',
            'number.positive': 'El ID del establecimiento debe ser un numero positivo.'
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
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); 

module.exports = {
  createAgendaSchema,
  updateAgendaSchema
};