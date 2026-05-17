"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'AsignarServicio',
    tableName: 'asignar_servicio',
    columns: {
        id_asignacion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha_asignada: {
            type: 'date',
            nullable: false,
        },
    },
});

//falta relacionarla con servicio, trabajador, coordinador(usuario)