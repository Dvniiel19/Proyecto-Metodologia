"use strict";
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Contrato',
    tableName: 'contrato',
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
        id_cliente: {
            type: 'int',
            nullable: false,
        },
    },
    
    relations: {
        cliente: {
            target: 'Cliente',
            type: 'many-to-one',
            joinColumn: {name: 'id_cliente'},
            inverseSide: 'contrato',
        },
        agenda: {
            target: 'Agenda',
            type: 'one-to-many',
            inverseSide: 'contrato',
        },
    },
});

