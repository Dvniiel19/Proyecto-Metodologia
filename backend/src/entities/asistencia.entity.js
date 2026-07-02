"use strict";

/**
 * Entidad Asistencia: registro del reloj control. Cada fila guarda la fecha,
 * hora de entrada y hora de salida (null mientras el trabajador no fiche salida)
 * de un trabajador en un servicio.
 */
const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'Asistencia',
    tableName: 'asistencia',
    columns: {
        id_asistencia: {
            primary: true,
            type: 'int',
            generated: true,
        },
        // [AGREGADO] Columna de fecha del dia laboral. Se genera automaticamente en registrarEntrada().
        fecha: {
            type: 'date',
            nullable: false,
        },
        hora_entrada: {
            type: 'time',
            nullable: false,
        },
        hora_salida: {
            type: 'time',
            nullable: true,
        },
        id_trabajador: {
            type: 'int',
            nullable: false,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
    relations: {
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador'},
            inverseSide: 'asistencia',
        },
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: {name: 'id_servicio'},
            inverseSide: 'asistencia',
        },
    },
});
