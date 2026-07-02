/**
 * Validaciones para Contratos
 * Aquí definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un contrato
const createContratoSchema = Joi.object({
  fecha_inicio: Joi.date()
    .iso() 
    .required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha valida',
      'date.format': 'La fecha de inicio debe tener formato  YYYY-MM-DD',
      'any.required': 'La fecha de inicio es un campo obligatorio'
    }),

  fecha_fin: Joi.date()
    .iso()
    .min(Joi.ref('fecha_inicio')) // Validar que la fecha_fin sea mayor o igual a fecha_inicio
    .required()
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha valida',
      'date.format': 'La fecha de fin debe tener formato ISO (ej. YYYY-MM-DD)',
      'date.min': 'La fecha de fin no puede ser anterior a la fecha de inicio',
      'any.required': 'La fecha de fin es un campo obligatorio'
    }),

  precio: Joi.number()
    .positive() // Asegura que el precio sea mayor a 0
    .precision(5) 
    .required()
    .messages({
      'number.base': 'El precio debe ser un numero',
      'number.positive': 'El precio debe ser mayor a 0',
      'number.precision': 'El precio no puede tener más de 5 decimales',
      'any.required': 'El precio es un campo obligatorio'
    }), 
    id_cliente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del cliente debe ser un numero.',
            'number.integer': 'El ID del cliente debe ser un numero entero.',
            'number.positive': 'El ID del cliente debe ser un numero positivo.',
            'any.required': 'El ID del cliente es un campo obligatorio.'
        })

});

// Esquema para actualizar un contrato (PATCH)
const updateContratoSchema = Joi.object({
  fecha_inicio: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha valida',
      'date.format': 'La fecha de inicio debe tener formato YYYY-MM-DD'
    }),

  fecha_fin: Joi.date()
    .iso()
    .min(Joi.ref('fecha_inicio'))
    .optional()
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha valida',
      'date.format': 'La fecha de fin debe tener formato YYYY-MM-DD',
      'date.min': 'La fecha de fin no puede ser anterior a la fecha de inicio'
    }),

  precio: Joi.number()
    .positive()
    .precision(5)
    .optional()
    .messages({
      'number.base': 'El precio debe ser un numero',
      'number.positive': 'El precio debe ser mayor a 0',
      'number.precision': 'El precio no puede tener mas de 5 decimales'
    }),
    id_cliente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del cliente debe ser un numero.',
            'number.integer': 'El ID del cliente debe ser un numero entero.',
            'number.positive': 'El ID del cliente debe ser un numero positivo.',
            'any.required': 'El ID del cliente es un campo obligatorio.'
        })

}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
});

module.exports = {
  createContratoSchema,
  updateContratoSchema
};