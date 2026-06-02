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
      'date.base': 'La fecha programada debe ser una fecha válida',
      'date.format': 'La fecha programada debe tener un formato ISO (ej. YYYY-MM-DD)',
      'any.required': 'La fecha programada es un campo obligatorio'
    }),

  estado: Joi.string()
    .valid('pendiente', 'completada') // Restringe a los valores reales que usas
    .max(50) 
    .required()
    .messages({
      'string.base': 'El estado debe ser un texto',
      'any.only': 'El estado solo puede ser "pendiente" o "completada"',
      'string.max': 'El estado no puede exceder los 50 caracteres',
      'any.required': 'El estado es un campo obligatorio'
    }),

  // Clave foránea para la relación con Establecimiento
  id_establecimiento: Joi.number()
    .integer()
    .positive()
    .required() // Asumo que es obligatorio, quita el .required() si puede ser null
    .messages({
      'number.base': 'El ID del establecimiento debe ser un número',
      'number.integer': 'El ID del establecimiento debe ser un número entero',
      'number.positive': 'El ID del establecimiento debe ser un número positivo',
      'any.required': 'El ID del establecimiento es obligatorio'
    }),

  // Clave foránea para la relación con Contrato
  id_contrato: Joi.number()
    .integer()
    .positive()
    .required() // Asumo que es obligatorio, quita el .required() si puede ser null
    .messages({
      'number.base': 'El ID del contrato debe ser un número',
      'number.integer': 'El ID del contrato debe ser un número entero',
      'number.positive': 'El ID del contrato debe ser un número positivo',
      'any.required': 'El ID del contrato es obligatorio'
    })
});

// Esquema para actualizar un evento en la agenda (PATCH)
const updateAgendaSchema = Joi.object({
  fecha_programada: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha programada debe ser una fecha válida',
      'date.format': 'La fecha programada debe tener un formato ISO'
    }),

  estado: Joi.string()
    .valid('pendiente', 'completada')
    .max(50)
    .optional()
    .messages({
      'string.base': 'El estado debe ser un texto',
      'any.only': 'El estado solo puede ser "pendiente" o "completada"',
      'string.max': 'El estado no puede exceder los 50 caracteres'
    }),

  id_establecimiento: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del establecimiento debe ser un número',
      'number.integer': 'El ID del establecimiento debe ser un número entero',
      'number.positive': 'El ID del establecimiento debe ser un número positivo'
    }),

  id_contrato: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del contrato debe ser un número',
      'number.integer': 'El ID del contrato debe ser un número entero',
      'number.positive': 'El ID del contrato debe ser un número positivo'
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); 

module.exports = {
  createAgendaSchema,
  updateAgendaSchema
};