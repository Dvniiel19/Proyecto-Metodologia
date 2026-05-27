"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Establecimiento',
    tableName: 'establecimientos',
    columns: {
        id_establecimiento: {
            primary: true,
            type: 'int',
            generated: true,
        },
        direccion: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        tipo: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
    },
    relations: {
        cliente: {
            target: 'Cliente',
            type: 'many-to-one',
            joinColumn: { name: 'id_cliente'},
            inverseSide: 'establecimientos',
        },
        agendas: {
            target: 'Agenda',
            type: 'one-to-many',
            inverseSide: 'establecimiento',
        },
    },
});

//falta relacionar con la tabla cliente}