"use strict";

/**
 * Entidad Checklist: items de verificacion asociados a una jornada de la agenda,
 * para controlar que las labores se cumplan.
 */
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
            type: 'boolean', // Indica si la tarea esta completada o no
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
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
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
