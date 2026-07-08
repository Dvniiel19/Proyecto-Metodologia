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
            nullable: true,
        },
        estado: {
            type: 'varchar',
            length: 50,
            nullable: false,
            default: 'En Proceso',
        },
        foto_evidencia: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
    },
    relations: {
        checklists: {
            target: 'Checklist',
            type: 'one-to-many', 
            inverseSide: 'tarea', 
        },
        asignacion_servicio: {
            target: 'AsignarServicio',
            type: 'many-to-one',
            joinColumn: { name: 'id_asignacion' },
            inverseSide: 'tareas',
            nullable: true,
        },
    },
});

