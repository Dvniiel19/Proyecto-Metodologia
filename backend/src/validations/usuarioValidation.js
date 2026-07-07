/**
 * Validaciones para Roles
 * Aqui definimos las reglas que deben cumplir los datos
 */

const Joi = require('joi');

const createUsuarioSchema = Joi.object({
    correo: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'El correo debe ser un texto',
            'string.empty': 'El correo no puede estar vacio',
            'string.email': 'Debes ingresar un correo valido',
            'any.required': 'El correo es un campo obligatorio'
        }),
    contrasena: Joi.string()
        .min(8)
        .max(21)
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
        }),
    id_rol: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El rol debe ser un numero',
            'number.integer': 'El rol debe ser un numero entero',
            'number.positive': 'El rol debe ser un numero positivo',
            'any.required': 'El rol es un campo obligatorio'
        }),
    fecha_expiracion: Joi.date().iso().optional().allow(null)
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

  contrasena: Joi.string()
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
      
    }),
    id_rol: Joi.number() //relacion
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El rol debe ser un numero',
      'number.integer': 'El rol debe ser un numero entero', // porque id_rol= un rol especifico
      'number.positive': 'El rol debe ser un numero positivo',
      'any.required': 'El rol es un campo obligatorio'
    }),
    fecha_expiracion: Joi.date().iso().optional().allow(null)
    
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo (correo o contraseña) para actualizar'
});

// Esquema para el registro unificado (POST /auth/register).
// Valida credenciales + datos de perfil en un solo payload.
// La direccion es condicional: se exige solo cuando el rol es Cliente. Como los
// IDs de rol pueden variar entre bases de datos, el rol no se resuelve aqui:
// el controller busca el nombre del rol y lo pasa por contexto Joi (esCliente).
const registerSchema = createUsuarioSchema.keys({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder los 50 caracteres',
      'any.required': 'El nombre es un campo obligatorio'
    }),
  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El apellido debe ser un texto',
      'string.empty': 'El apellido no puede estar vacio',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder los 50 caracteres',
      'any.required': 'El apellido es un campo obligatorio'
    }),
  telefono: Joi.string()
    .min(7)
    .max(15)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.base': 'El telefono debe ser un texto',
      'string.empty': 'El telefono no puede estar vacio',
      'string.min': 'El telefono debe tener al menos 7 digitos',
      'string.max': 'El telefono no puede exceder los 15 digitos',
      'string.pattern.base': 'El telefono solo puede contener numeros',
      'any.required': 'El telefono es un campo obligatorio'
    }),
  direccion: Joi.string()
    .max(255)
    .when('$esCliente', {
      is: true,
      then: Joi.required().messages({
        'any.required': 'La direccion es obligatoria para registrarse como cliente'
      }),
      otherwise: Joi.forbidden().messages({
        'any.unknown': 'La direccion solo aplica para el rol Cliente'
      }),
    })
    .messages({
      'string.base': 'La direccion debe ser un texto',
      'string.empty': 'La direccion no puede estar vacia',
      'string.max': 'La direccion no puede exceder los 255 caracteres'
    }),
});

// Esquema para iniciar sesion (POST /auth/login)
const loginSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'El correo debe ser un texto',
      'string.empty': 'El correo no puede estar vacio',
      'string.email': 'Debes ingresar un correo valido',
      'any.required': 'El correo es un campo obligatorio'
    }),
  contrasena: Joi.string()
    .required()
    .messages({
      'string.base': 'La contrasena debe ser un texto',
      'string.empty': 'La contrasena no puede estar vacia',
      'any.required': 'La contrasena es un campo obligatorio'
    })
});

module.exports = {

  createUsuarioSchema,
  updateUsuarioSchema,
  registerSchema,
  loginSchema
};