/**
 * Validaciones para Roles
 * Aqui definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un rol
const createRolSchema = Joi.object({
  nombre_rol: Joi.string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(3)
    .max(255) // Coincide con el length: 255 de tu EntitySchema
    .required()
    .messages({
      'string.base': 'El nombre del rol debe ser un texto',
      'string.empty': 'El nombre del rol no puede estar vacío',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no puede exceder los 255 caracteres',
      'any.required': 'El nombre del rol es un campo obligatorio'
    })
});

// Esquema para actualizar un rol
const updateRolSchema = Joi.object({
  nombre_rol: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .optional()
    .messages({
      'string.base': 'El nombre del rol debe ser un texto',
      'string.empty': 'El nombre del rol no puede estar vacío',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no puede exceder los 255 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); // Al menos debe enviarse un campo en el PATCH

module.exports = {
  createRolSchema,
  updateRolSchema
};