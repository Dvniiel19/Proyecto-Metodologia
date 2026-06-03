"use strict";

const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'Tarea',
    tableName: 'tareas',
    columns: {
        id_tarea: {
            primary: true,
            type: 'int',
            generated: true,
        },
        descripcion:{
            type: 'varchar',
            length: 255,
            nullable: false,
        },
    },
    relations: {
        checklists: {
            target: 'Checklist',
            type: 'one-to-many', 
            inverseSide: 'tarea', 
        },
    },
});

