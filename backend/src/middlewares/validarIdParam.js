"use strict";

const { sendError } = require('../handlers/responseHandler');

// Nombres de parametros de ruta que representan ids numericos en toda la API
const NOMBRES_ID = [
    'id_agenda',
    'id_asignacion',
    'id_asistencia',
    'id_checklist',
    'id_cliente',
    'id_consumo',
    'id_contrato',
    'id_evaluacion',
    'id_insumo',
    'id_rol',
    'id_tarea',
    'id_trabajador',
    'id_usuario',
    'id_validacion',
];

// Callback para router.param(): valida que el id sea un entero positivo.
// Sin esto, un id como "abc" llega a la base de datos, lanza un error y responde 500.
const validarIdParam = (req, res, next, valor, nombre) => {
    if (!/^\d+$/.test(valor)) {
        return sendError(res, `El parametro ${nombre} debe ser un numero entero positivo`, 400);
    }
    return next();
};

// Registra la validacion en un router para todos los nombres de id conocidos.
// router.param solo se activa si la ruta usa ese parametro, asi que registrar de mas es inofensivo.
const aplicarValidacionDeIds = (router) => {
    NOMBRES_ID.forEach((nombre) => router.param(nombre, validarIdParam));
};

module.exports = {
    aplicarValidacionDeIds,
};
