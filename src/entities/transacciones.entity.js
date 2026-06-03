"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Transaccion',
    tableName: 'transacciones',
    columns: {
        id_transaccion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        tipo_transaccion: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        monto: {
            type: 'decimal',
            precision: 10,
            scale: 2,
            nullable: false,
        },
        fecha_emision: {
            type: 'date',
            nullable: false,
        },
        fecha_pago: {
            type: 'date',
            nullable: true,
        },
        estado_pago: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
    },
    relations: {
        contrato: {
            target: 'Contrato', 
            type: 'many-to-one', 
            joinColumn: { name: 'id_contrato' }, 
            inverseSide: 'transacciones', 
        }
    },
});

