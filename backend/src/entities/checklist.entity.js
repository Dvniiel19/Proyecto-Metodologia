"use strict";

const { EntitySchema } = require('typeorm');

// Esquema de la entidad Checklist.
// Registra el estado de cada tarea realizada dentro de un servicio,
// incluyendo evidencia fotográfica cuando corresponda.
module.exports = new EntitySchema({
    name: 'Checklist',
    tableName: 'checklist',

    // Definición de las columnas de la tabla
    columns: {
        // Clave primaria autoincremental
        id_checklist: {
            primary: true,
            type: 'int',
            generated: true,
        },

        // Indica si la tarea fue completada.
        // true = completada, false = pendiente.
        completado: {
            type: 'boolean',
            nullable: false,
        },

        // Ruta o URL donde se almacena la fotografía
        // como evidencia de la realización del servicio.
        foto_servicio: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },

        // Llave foránea que identifica el servicio al que
        // pertenece el checklist.
        id_servicio: {
            type: 'int',
            nullable: false,
        },

        // Llave foránea que identifica la tarea evaluada
        // dentro del checklist.
        id_tarea: {
            type: 'int',
            nullable: false,
        },
    },

    // Relaciones con otras entidades
    relations: {

        // Muchos registros del checklist pueden pertenecer
        // a un mismo servicio.
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio' },
            inverseSide: 'checklist',
        },

        // Muchos registros del checklist pueden estar
        // asociados a una misma tarea.
        tarea: {
            target: 'Tarea',
            type: 'many-to-one',
            joinColumn: { name: 'id_tarea' },
            inverseSide: 'checklist',
        },
    },
});