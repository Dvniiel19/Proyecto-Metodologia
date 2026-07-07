// Configuracion de variables de entorno
require('dotenv').config();

const config = {
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;