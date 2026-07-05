const express = require('express');
const router = express.Router();
const { aplicarValidacionDeIds } = require('../middlewares/validarIdParam');
aplicarValidacionDeIds(router); // responde 400 si un id de la URL no es numerico
const { login, registro, rolesRegistrables } = require('../controllers/usuarioController');

// Ruta para iniciar sesion
router.post('/login', login);

// Ruta para registrarse (crea Usuario + perfil Cliente/Trabajador en una transaccion)
router.post('/register', registro);

// Roles disponibles para el registro publico (alimenta el select del formulario)
router.get('/roles-registrables', rolesRegistrables);

module.exports = router;