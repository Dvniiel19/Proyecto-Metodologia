"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Insumo',
    tableName: 'insumos',
    columns: {
        id_insumo: {
            primary: true,
            type: 'int',
            generated: true,
        },
        nombre_insumo: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        stock: {
            type: 'int',
            nullable: false,
        },
    },
});