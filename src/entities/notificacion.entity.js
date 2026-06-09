"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Notificacion',
    tableName: 'notificaciones',
    columns: {
        id_notificacion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        mensaje: {
            type: 'varchar',
            length: 500,
            nullable: false,
        },
        leida: {
            type: 'boolean',
            nullable: false,
            default: false,
        },
        fecha_creacion: {
            type: 'timestamp',
            nullable: false,
            default: () => 'CURRENT_TIMESTAMP', // para que se asigne la fecha actual al crear la notificacion
        },
        id_trabajador: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador' },
            inverseSide: 'notificaciones',
        },
    },
});