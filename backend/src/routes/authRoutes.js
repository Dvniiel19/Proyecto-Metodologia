const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const { login } = require('../controllers/usuarioController');

// Ruta para iniciar sesion
router.post('/login', login);

module.exports = router;