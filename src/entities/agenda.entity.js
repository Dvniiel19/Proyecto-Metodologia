"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({

    name: 'Agenda',
    tableName: 'agenda',
    columns: {
        id_servicio: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha_programada: {
            type: 'date',
            nullable: false,
        },
        estado: { //pendiente, completada
            type: 'varchar',
            length: 50,
            nullable: false,
        },
    },
});


//falta relacionarla con establecimiento y contrato