"use strict";

const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'Asistencia',
    tableName: 'asistencias',
    columns: {
        id_asistencia: {
            primary: true,
            type: 'int',
            generated: true,
        },
        hora_entrada: {
            type: 'time',
            nullable: false,
        },
        hora_salida: {
            type: 'time',
            nullable: false, //no puede ser null porque se necesita para calcular horas trabajadas
        },
    },
    relations: {
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador'},
            inverseSide: 'asistencias',
        },
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: {name: 'id_servicio'},
            inverseSide: 'asistencias',
        },
    },
});
