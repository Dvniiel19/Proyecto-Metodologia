"use strict";

/**
 * Entidad AsignarServicio: tabla intermedia que conecta a un trabajador
 * con una jornada de la agenda. Cada fila = "este trabajador atiende esta jornada".
 */
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
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
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
