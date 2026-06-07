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

  estado: Joi.boolean() 
    .optional()
    .messages({
      'boolean.base': 'El estado debe ser un valor verdadero o falso (true/false)'
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
    })
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar'
}); 

module.exports = {
  createAsignarServicioSchema,
  updateAsignarServicioSchema
};