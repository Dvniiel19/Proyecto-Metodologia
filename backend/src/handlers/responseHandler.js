/**
 * Manejador de respuestas estandarizadas
 * Centraliza la forma en que respondemos a los clientes
 */

const { formatearFechasChile } = require('../utils/fechas');

const sendSuccess = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    // Las fechas salen siempre en formato chileno 
    data: formatearFechasChile(data)
  });
};

const sendError = (res, message = 'Error interno', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  sendSuccess,
  sendError
};
