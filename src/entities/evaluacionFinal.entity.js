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
    },
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'one-to-one',
            joinColumn: { name: 'id_servicio'}, 
        }
    },
});
