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
        limite_seguridad: { //para saber cuando es necesario reabastecer
            type: 'int',
            nullable: true,
        },
    },
    relations: {
        consumos: {
            target: 'ConsumoInsumo',
            type: 'one-to-many', 
            inverseSide: 'insumo',
        }
    },
});