"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Contrato',
    tableName: 'contratos',
    columns: {
        id_contrato: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha_inicio: {
            type: 'date',
            nullable: false,
        },
        fecha_fin: {
            type: 'date',
            nullable: false,
        },
        precio: {
            type: 'decimal',
            precision: 10, 
            scale: 2, 
            nullable: false,
        },
    },
    relations: {
        cliente: {
            target: 'Cliente',
            type: 'many-to-one',
            joinColumn: {name: 'id_cliente'},
            inverseSide: 'contratos',
        },
        agenda: {
            target: 'Agenda',
            type: 'one-to-many',
            inverseSide: 'contratos',
        },
    },
});

