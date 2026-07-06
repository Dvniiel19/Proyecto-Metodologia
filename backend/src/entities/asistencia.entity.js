"use strict";
const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'Asistencia',
    tableName: 'asistencia',
    columns: {
        id_asistencia: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha: {
            type: 'date',
            nullable: false,
            default: () => 'CURRENT_DATE',
        },
        // Nullable porque una inasistencia (estado 'Ausente') no tiene hora de entrada
        hora_entrada: {
            type: 'time',
            nullable: true,
        },
        //Distingue asistencias reales de ausencias registradas manualmente
        estado_asistencia: {
            type: 'varchar',
            length: 20,
            nullable: false,
            default: 'Presente',
        },
        hora_salida: {
            type: 'time',
            nullable: true,
        },
        id_trabajador: {
            type: 'int',
            nullable: false,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
    },
    
    relations: {
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador'},
            inverseSide: 'asistencia',
        },
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: {name: 'id_servicio'},
            inverseSide: 'asistencia',
        },
    },
});
