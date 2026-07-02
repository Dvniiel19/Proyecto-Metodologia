"use strict";

/**
 * Entidad Tarea: labor concreta dentro de una asignacion de servicio.
 * Su estado avanza hasta "Pendiente de Validacion" cuando el trabajador la
 * finaliza subiendo su foto de evidencia.
 */
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
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
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

