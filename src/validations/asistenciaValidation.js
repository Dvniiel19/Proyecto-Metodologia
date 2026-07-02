/**
 * Validaciones para asistencias
 * Aquí definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/; // para hora

// Esquema para crear un asistencia
const createAsistenciaSchema = Joi.object({
  hora_entrada: Joi.string()
    .pattern(timeRegex)
    .required()
    .messages({
      'string.base': 'La hora de entrada debe ser texto',
      'string.pattern.base': 'La hora de entrada debe tener formato HH:MM:SS',
      'any.required': 'La hora de entrada es un campo obligatorio'
    }),

  hora_salida: Joi.string()
    .pattern(timeRegex)
    .required()
    .messages({
      'string.base': 'La hora de salida debe ser texto',
      'string.pattern.base': 'La hora de salida debe tener formato HH:MM:SS',
      'any.required': 'La hora de salida es un campo obligatorio'
    }),
    id_trabajador: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del trabajador debe ser un numero.',
            'number.integer': 'El ID del trabajador debe ser un numero entero.',
            'number.positive': 'El ID del trabajador debe ser un numero positivo.',
            'any.required': 'El ID del trabajador es un campo obligatorio.'
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
        })

});


// Esquema para actualizar un asistencia (PATCH)
const updateAsistenciaSchema = Joi.object({
  hora_entrada: Joi.string()
    .pattern(timeRegex)
    .required()
    .messages({
      'string.base': 'La hora de entrada debe ser texto',
      'string.pattern.base': 'La hora de entrada debe tener formato HH:MM:SS',
      'any.required': 'La hora de entrada es un campo obligatorio'
    }),

  hora_salida: Joi.string()
    .pattern(timeRegex)
    .required()
    .messages({
      'string.base': 'La hora de salida debe ser texto',
      'string.pattern.base': 'La hora de salida debe tener formato HH:MM:SS',
      'any.required': 'La hora de salida es un campo obligatorio'
    }),
    id_trabajador: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del trabajador debe ser un numero.',
            'number.integer': 'El ID del trabajador debe ser un numero entero.',
            'number.positive': 'El ID del trabajador debe ser un numero positivo.',
            'any.required': 'El ID del trabajador es un campo obligatorio.'
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
        })

}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
});

module.exports = {
  createAsistenciaSchema,
  updateAsistenciaSchema
};