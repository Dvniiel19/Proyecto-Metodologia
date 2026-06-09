"use strict";

const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'EvaluacionFinal',
    tableName: 'evaluacion_final',
    columns: {
        id_evaluacion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        nota: {
            type: 'int', //entero porque va a ser de 1-5
            nullable: false,
        },
        comentarios: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        id_servicio: { // para relacionar la evaluacion con el servicio que se esta evaluando
            type: 'int',
            nullable: false,
        },
    },
    uniques: [ // para asegurar que cada servicio tenga solo una evaluacion final
        {
            name: 'UQ_EVALUACION_SERVICIO', // nombre de la restriccion de unicidad
            columns: ['id_servicio'],
        },
    ],
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'one-to-one',
            joinColumn: { name: 'id_servicio' },
        }
    },
});
