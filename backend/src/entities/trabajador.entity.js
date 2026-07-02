"use strict";

/**
 * Entidad Trabajador: datos personales del trabajador. Se enlaza 1 a 1 con
 * un Usuario (credenciales) y recibe asignaciones, asistencias y notificaciones.
 */
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
        id_usuario: {
            type: 'int',
            nullable: true,
        },
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
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
        notificaciones: {
        target: 'Notificacion',
        type: 'one-to-many',
        inverseSide: 'trabajador',
        },
    },
});
