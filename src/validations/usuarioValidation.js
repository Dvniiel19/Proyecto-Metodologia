/**
 * Validaciones para Roles
 * Aquí definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

// Esquema para crear un usuario
const createUsuarioSchema = Joi.object({
  correo: Joi.string()
    .email() // valida que tenga el @ y un dominio
    .required()
    .messages({
      'string.base': 'El correo debe ser un texto',
      'string.empty': 'El correo no puede estar vacio',
      'string.email': 'Debes ingresar un correo valido',
      'any.required': 'El correo es un campo obligatorio'
    }),
  contrasena: Joi.string() 
    .min(8)
    .max(21) // en base a la contraseña de apple 
    .pattern(/[A-Z]/, 'Letra mayuscula')
    .pattern(/[a-z]/, 'Letra minuscula')
    .pattern(/\d/, 'Numero')
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'Caracter especial')
    .required()
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña no puede estar vacia',
      'string.min': 'La contraseña debe tener minimo 8 caracteres',
      'string.max': 'La contraseña no puede exceder los 21 caracteres',
      'patron_mayuscula': 'La contraseña debe tener minimo una mayuscula',
      'patron_minuscula': 'La contraseña debe tener minimo una minuscula',
      'patron_numero': 'La contraseña debe tener minimo un numero',
      'patron_especial': 'La contraseña debe tener minimo un caracter especial',
      'any.required': 'La contraseña es un campo obligatorio'
    })
});

// Esquema para actualizar un rol
const updateUsuarioSchema = Joi.object({
  correo: Joi.string()
    .email()
    .optional()
    .messages({
      'string.base': 'El correo debe ser un texto',
      'string.empty': 'El correo no puede estar vacio',
      'string.email': 'Debes ingresar un correo valido'
    }),

  contraseña: Joi.string()
    .min(8)
    .max(21)
    .pattern(/[A-Z]/, 'Letra mayuscula')
    .pattern(/[a-z]/, 'Letra minuscula')
    .pattern(/\d/, 'Numero')
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'Caracter especial')
    .optional()
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña no puede estar vacia',
      'string.min': 'La contraseña debe tener minimo 8 caracteres',
      'string.max': 'La contraseña no puede exceder los 21 caracteres',
      'patron_mayuscula': 'La contraseña debe tener minimo una mayuscula',
      'patron_minuscula': 'La contraseña debe tener minimo una minuscula',
      'patron_numero': 'La contraseña debe tener minimo un numero',
      'patron_especial': 'La contraseña debe tener minimo un caracter especial',
      
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo (correo o contraseña) para actualizar'
});

module.exports = {
  createUsuarioSchema,
  updateUsuarioSchema
};