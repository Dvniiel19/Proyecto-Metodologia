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
    },
});

//relacionar con agenda y insumos