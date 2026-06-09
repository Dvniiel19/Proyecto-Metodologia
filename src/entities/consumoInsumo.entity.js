"use strict"; 

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'ConsumoInsumo',
    tableName: 'consumo_insumo',
    columns: {
        id_consumo: {
            primary: true,
            type: 'int',
            generated: true,
        },
        cantidad_utilizada: {
            type: 'int',
            nullable: false,
        },
        id_insumo: {
            type: 'int',
            nullable: false,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        insumo: {
            target: 'Insumo',
            type: 'many-to-one',
            joinColumn: { name: 'id_insumo'},
            inverseSide: 'consumo_insumo',
        },
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio'},
            inverseSide: 'consumo_insumo', 
        },
    },
});
