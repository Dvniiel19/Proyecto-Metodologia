/**
 * Validaciones para agenda
 * Aqui definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un evento en la agenda
const createAgendaSchema = Joi.object({
  fecha_programada: Joi.date()
    .iso() // Asegura formato YYYY-MM-DD
    .raw() // conserva el string original: castear a Date (UTC) restaba un dia al guardar
    .required()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha valida',
      'date.format': 'La fecha programada debe tener un formato YYYY-MM-DD',
      'any.required': 'La fecha programada es un campo obligatorio'
    }),
    hora_inicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
    'string.pattern.base': 'La hora de inicio debe tener formato HH:MM',
    'any.required': 'La hora de inicio es obligatoria'
    }),

    hora_fin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
    'string.pattern.base': 'La hora de fin debe tener formato HH:MM',
    'any.required': 'La hora de fin es obligatoria'
    }),

  estado: Joi.string()
    .optional()
    .messages({
        'string.base': 'El estado debe ser texto'
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
    .raw() // conserva el string original: castear a Date (UTC) restaba un dia al guardar
    .optional()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha valida',
      'date.format': 'La fecha programada debe tener un formato YYYY-MM-DD'
    }),
    hora_inicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
    'string.pattern.base': 'La hora de inicio debe tener formato HH:MM'
    }),

hora_fin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
    'string.pattern.base': 'La hora de fin debe tener formato HH:MM'
    }),

  estado: Joi.string()
    .optional()
    .messages({
        'string.base': 'El estado debe ser texto'
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

// Esquema para marcar el trabajo como terminado (PUT /agenda/:id/terminar-trabajo)
// El body es opcional: solo puede traer una observacion final del trabajador
const terminarTrabajoSchema = Joi.object({
  observacion_final: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.base': 'La observacion final debe ser texto',
      'string.max': 'La observacion final no puede superar los 1000 caracteres'
    })
});

module.exports = {
  createAgendaSchema,
  updateAgendaSchema,
  terminarTrabajoSchema
};