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
        tipo_movimiento: {
            type: 'varchar',
            length: 20,
            nullable: true, 
        },
        observaciones: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        fecha_emision: {
            type: 'timestamp',
            createDate: true, // se completa automaticamente al crear el registro
        },
        id_insumo: {
            type: 'int',
            nullable: false,
        },
        id_servicio: {
            // Nullable: los movimientos de ingreso de stock no estan ligados
            // a una jornada, por eso existen registros historicos sin servicio
            type: 'int',
            nullable: true,
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
