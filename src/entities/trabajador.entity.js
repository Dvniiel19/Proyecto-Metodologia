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
    },
});

//falta relacionar con la tabla usuario