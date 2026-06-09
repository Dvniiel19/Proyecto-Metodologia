//Validaciones para agenda
//Aqui definimos las reglas que deben cumplir los datos*/

const Joi = require('joi');

// Esquema para crear un evento en la agenda
const createAsignarServicioSchema = Joi.object({
  fecha_asignada: Joi.date()
    .iso() // Asegura formato YYYY-MM-DD
    .required()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha valida',
      'date.format': 'La fecha programada debe tener un formato YYYY-MM-DD',
      'any.required': 'La fecha programada es un campo obligatorio'
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

    id_usuario: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del usuario coordinador debe ser un numero.',
            'number.integer': 'El ID del usuario coordinador debe ser un numero entero.',
            'number.positive': 'El ID del usuario coordinador debe ser un numero positivo.',
            'any.required': 'El ID del usuario coordinador es un campo obligatorio.'
        })
});

// Esquema para actualizar un evento en la agenda (PATCH)
const updateAsignarServicioSchema = Joi.object({
  fecha_asignada: Joi.date()
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

    id_usuario: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del usuario coordinador debe ser un numero.',
            'number.integer': 'El ID del usuario coordinador debe ser un numero entero.',
            'number.positive': 'El ID del usuario coordinador debe ser un numero positivo.',
            'any.required': 'El ID del usuario coordinador es un campo obligatorio.'
        })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); 

module.exports = {
  createAsignarServicioSchema,
  updateAsignarServicioSchema
};