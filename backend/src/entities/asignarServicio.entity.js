"use strict";
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'AsignarServicio',
    tableName: 'asignar_servicio',
    columns: {
        id_asignacion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        fecha_asignada: {
            type: 'date',
            nullable: false,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
        id_trabajador: {
            type: 'int',
            nullable: false,
        },
        id_usuario: {
            type: 'int',
            nullable: false,
        },
        descripcion: {
            // Descripcion de la tarea a realizar; nullable porque las
            // asignaciones creadas antes de este campo no la tienen
            type: 'varchar',
            length: 255,
            nullable: true,
        },
    },
  
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio'},
            inverseSide: 'asignar_servicio',
        },
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador'},
            inverseSide: 'asignar_servicio',
        },
        usuario: {
            target: 'Usuario',
            type: 'many-to-one',
            joinColumn: { name: 'id_usuario'}, // Guardara el ID del Coordinador
            inverseSide: 'asignaciones_servicio',
        },
            tareas: {
                target: 'Tarea',
                type: 'one-to-many',
                inverseSide: 'asignacion_servicio',
        },
    },
    
});
