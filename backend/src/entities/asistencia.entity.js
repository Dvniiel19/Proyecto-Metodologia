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
        // El default CURRENT_DATE permite que synchronize agregue la columna NOT NULL
        // sobre una tabla que ya tiene filas sin que Postgres rechace el ALTER TABLE.
        fecha: {
            type: 'date',
            nullable: false,
            default: () => 'CURRENT_DATE',
        },
        // Nullable porque una inasistencia (estado 'Ausente') no tiene hora de entrada
        hora_entrada: {
            type: 'time',
            nullable: true,
        },
        // [AGREGADO] Distingue asistencias reales de ausencias registradas manualmente
        estado_asistencia: {
            type: 'varchar',
            length: 20,
            nullable: false,
            default: 'Presente',
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
