/**
 * Manejador de respuestas estandarizadas
 * Centraliza la forma en que respondemos a los clientes
 */

const { formatearFechasChile } = require('../utils/fechas');

const sendSuccess = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  let fechasFormateadas;
  try {
    fechasFormateadas = formatearFechasChile(data);
  } catch {
    fechasFormateadas = data;
  }
  return res.status(statusCode).json({
    success: true,
    message,
    // Las fechas salen siempre en formato chileno
    data: fechasFormateadas,
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
