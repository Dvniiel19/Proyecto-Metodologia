"use strict";

/**
 * Entidad EvaluacionFinal: evaluacion que deja el cliente al terminar
 * una jornada (relacion 1 a 1 con la agenda).
 */
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
        // [AGREGADO] trabajador responsable del servicio evaluado, para poder
        // calcular su promedio de satisfaccion. Nullable porque la tabla ya
        // puede tener filas de antes de este campo (synchronize no permite
        // agregar una NOT NULL sin default sobre una tabla con datos).
        id_trabajador: {
            type: 'int',
            nullable: true,
        },
    },
    uniques: [ // para asegurar que cada servicio tenga solo una evaluacion final
        {
            name: 'UQ_EVALUACION_SERVICIO', // nombre de la restriccion de unicidad
            columns: ['id_servicio'],
        },
    ],
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'one-to-one',
            joinColumn: { name: 'id_servicio' },
        },
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador' },
            inverseSide: 'evaluaciones',
        },
    },
});
