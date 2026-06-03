/**
 * Validaciones para Contratos
 * Aquí definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un contrato
const createasistenciaSchema = Joi.object({
  hora_inicio: Joi.date()
    .iso() 
    .required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha valida',
      'date.format': 'La fecha de inicio debe tener formato  HH/MM/SS)', // HORA, MINUTO Y SEGUNDOS
      'any.required': 'La fecha de inicio es un campo obligatorio'
    }),

  hora_fin: Joi.date()
    .iso()
    .min(Joi.ref('hora_inicio')) // Validar que la hora_fin sea mayor o igual a hora_inicio
    .required()
    .messages({
      'date.base': 'La hora de fin debe ser una hora valida',
      'date.format': 'La hora de fin debe tener formato  (ej. HH/MM/SS )', // HORA, MINUTO Y SEGUNDOS
      'date.min': 'La hora de fin no puede ser anterior a la hora de inicio',
      'any.required': 'La hora   de fin y inicio es un campo obligatorio'
    }),

})


// Esquema para actualizar un contrato (PATCH)
const updateasistenciaSchema = Joi.object({
  hora_inicio: Joi.date()
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
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
});

module.exports = {
  createContratoSchema,
  updateContratoSchema
};