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
});

//falta relacionar con la tabla cliente}