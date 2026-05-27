/**
 * Validaciones para clientes
 * Aqui definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un cliente
const createClienteSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(3)
    .max(255) 
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder los 255 caracteres',
      'any.required': 'El nombre es un campo obligatorio'
    }),

  apellido: Joi.string()
    .trim()
    .min(3)
    .max(255) 
    .required()
    .messages({
      'string.base': 'El texto debe ser un texto',
      'string.empty': 'El texto no puede estar vacio',
      'string.min': 'El texto debe tener al menos 3 caracteres',
      'string.max': 'El texto no puede exceder los 255 caracteres',
      'any.required': 'El texto es un campo obligatorio'
    }),

  telefono: Joi.string()
    .trim()
    .min(8)
    .max(20)  
    .pattern(/^[+0-9\s]+$/) //numeros, espacios y el signo +
    .required()
    .messages({
      'string.base': 'El telefono debe ser un texto',
      'string.empty': 'El telefono no puede estar vacio',
      'string.min': 'El telefono debe tener al menos 8 caracteres',
      'string.max': 'El telefono no puede exceder los 20 caracteres',
      'string.pattern.base': 'El formato del telefono es invalido. Solo se aceptan numeros, espacios y el signo +',
      'any.required': 'El telefono es un campo obligatorio'
    }),
  historial_servicio: Joi.string()
    .trim()
    .min(10)
    .max(300) 
    .required()
    .messages({
      'string.base': 'Debe de ser un texto',
      'string.empty': 'El texto no puede estar vacio',
      'string.min': 'El texto debe tener al menos 10 caracteres',
      'string.max': 'El texto no puede exceder los 300 caracteres',
      'any.required': 'El texto es un campo obligatorio'
    }),
});

// Esquema para actualizar un trabajador
const updateClienteSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder los 255 caracteres'
    }),

  apellido: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.base': 'El apellido debe ser un texto',
      'string.empty': 'El apellido no puede estar vacio',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder los 255 caracteres'
    }),

  telefono: Joi.string()
    .trim()
    .min(8)
    .max(20)
    .pattern(/^[+0-9\s]+$/)
    .optional()
    .messages({
      'string.base': 'El telefono debe ser un texto',
      'string.empty': 'El telefono no puede estar vacio',
      'string.min': 'El telefono debe tener al menos 8 caracteres',
      'string.max': 'El telefono no puede exceder los 20 caracteres',
      'string.pattern.base': 'El formato del telefono es invalido. Solo se aceptan numeros, espacios y el signo +'
    }),
  historial_servicio: Joi.string()
    .trim()
    .min(10)
    .max(300) 
    .required()
    .messages({
      'string.base': 'Debe de ser un texto',
      'string.empty': 'El texto no puede estar vacio',
      'string.min': 'El texto debe tener al menos 10 caracteres',
      'string.max': 'El texto no puede exceder los 300 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); // Al menos debe enviarse un campo en el PATCH

module.exports = {
  createClienteSchema,
  updateClienteSchema
};