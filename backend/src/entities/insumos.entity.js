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
            default: 0,
        },
    
        // Estado del insumo (normal o critico)
        estado_insumo:{
            type:'varchar',
            length:50,
            nullable:false,
            default: 'Normal', //normal o stock critico
        },
        //fecha creacion y ultima actualizacion
        fecha_creacion: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        fecha_actualizacion:{
            type: 'timestamp',
            default:() => 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
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