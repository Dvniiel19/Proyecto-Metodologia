"use strict";
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Trabajador',
    tableName: 'trabajadores',
    columns: {
        id_trabajador: {
            primary: true,
            type: 'int',
            generated: true,
        },
        nombre: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        apellido: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        telefono: {
            type: 'varchar',
            length: 20,
            nullable: false,
        },
        id_usuario: {
            type: 'int',
            nullable: true,
        },
        promedio_satisfaccion: {
            type: 'decimal',
            precision: 3,
            scale: 2,
            nullable: true,
        },
    },
    relations: {
        usuario: {
            target: 'Usuario',
            type: 'one-to-one',
            joinColumn: { name: 'id_usuario'},
            inverseSide: 'trabajador',
        },
        asignar_servicio: {
            target: 'AsignarServicio',
            type: 'one-to-many',
            inverseSide: 'trabajador',
        },
        asistencias: {
            target: 'Asistencia',
            type: 'one-to-many',
            inverseSide: 'trabajador',
        },
        notificaciones: {
        target: 'Notificacion',
        type: 'one-to-many',
        inverseSide: 'trabajador',
        },
        evaluaciones: {
            target: 'EvaluacionFinal',
            type: 'one-to-many',
            inverseSide: 'trabajador',
        },
    },
});
