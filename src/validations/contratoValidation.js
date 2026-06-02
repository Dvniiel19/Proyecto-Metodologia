/**
 * Validaciones para Roles
 * Aquí definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un contrato
const createfechainicioContratoSchema = Joi.object({
  fechain_contrato: Joi.string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(10)
    .max(20) // Coincide con el length: 20 de tu EntitySchema     
    .required()
    .pattern(/^[+0-9\s]+$/) //numeros, espacios y el signo +
    .messages({
      'string.base': 'La fecha de inicio del contrato debe ser correcta',
      'string.empty': 'La fecha de inicio del contrato no puede estar vacía',
      'string.min': 'La fecha de inicio del contrato debe tener almenos 10 caracteres',
      'string.max': 'La fecha de inicio del contrato no puede exceder los 20 caracteres',
      'any.required': 'La fecha de inicio del contrato es un campo obligatorio'
    })
});


const fechafinSchema = Joi.object({
  fechafin_contrato: Joi.string()
    .trim()
    .min(10)
    .max(20)
    .pattern(/^[+0-9\s]+$/) //numeros, espacios y el signo +
    .optional()
    .messages({
      'string.base': 'La fecha de finalización del contrato debe ser correcta',
      'string.empty': 'La fecha de finalización del contrato no puede estar vacía',
      'string.min': 'La fecha de finalización del contrato debe tener al menos 10 caracteres',
      'string.max': 'La fecha de finalización del contrato no puede exceder los 20 caracteres'
    })
});

const precioContratoSchema = Joi.object({
  precio_contrato: Joi.string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(10)
    .max(20) // Coincide con el length: 20 de tu EntitySchema     
    .required()
    .pattern(/^[+0-9\s]+$/) //numeros, espacios y el signo +
    .messages({
      'string.base': 'el precio del contrato debe ser correcta',
      'string.empty': 'El precio del contrato no puede estar vacío',
      'string.min': 'El precio del contrato debe tener al menos 10 caracteres',
      'string.max': 'El precio del contrato no puede exceder los 20 caracteres',
      'any.required': 'El precio del contrato es un campo obligatorio'
    })
});

module.exports = {
  createfechainicioContratoSchema,
  fechafinSchema,
  precioContratoSchema
};