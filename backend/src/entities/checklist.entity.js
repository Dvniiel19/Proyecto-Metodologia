"use strict";

const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'Checklist',
    tableName: 'checklist',
    columns: {
        id_checklist: {
            primary: true,
            type: 'int',
            generated: true,
        },
        completado: {
            type: 'boolean', // Indica si la tarea está completada o no
            nullable: false,
        },
        foto_servicio: {
            type: 'varchar', //para alamacer irl
            length: 255,
            nullable: true,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
        id_tarea: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio'},
            inverseSide: 'checklist',
        },
        tarea: {
            target: 'Tarea',
            type: 'many-to-one',
            joinColumn: { name: 'id_tarea'},
            inverseSide: 'checklist',
        },
    },
});
