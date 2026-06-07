"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({

    name: 'Agenda',
    tableName: 'agenda',
    columns: {
        id_servicio: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha_programada: {
            type: 'date',
            nullable: false,
        },
        estado: { 
            type: 'boolean',
            nullable: false,
            default: false,  
        },
    },
    relations: {
        establecimiento: {
            target: 'Establecimiento',
            type: 'many-to-one',
            joinColumn: {name: 'id_establecimiento'},
            inverseSide: 'agenda',
        },
        contrato: {
            target: 'Contrato',
            type: 'many-to-one',
            joinColumn: { name: 'id_contrato'},
            inverseSide: 'agenda',
        },
        asignar_servicio: {
            target: 'AsignarServicio',
            type: 'one-to-many',
            inverseSide: 'agenda',
        },
        asistencia: {
            target: 'Asistencia',
            type: 'one-to-many',
            inverseSide: 'agenda',
        },
        checklist: {
            target: 'Checklist',
            type: 'one-to-many',
            inverseSide: 'agenda',
        },
        consumo_insumo: {
            target: 'ConsumoInsumo',
            type: 'one-to-many',
            inverseSide: 'agenda',
        },
    },
});

