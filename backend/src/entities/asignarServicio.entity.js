"use strict";

const { EntitySchema } = require('typeorm');

// Esquema de la entidad AsignarServicio.
// Representa la asignación de un servicio a un trabajador realizada por un usuario.
module.exports = new EntitySchema({
    name: 'AsignarServicio',
    tableName: 'asignar_servicio',

    // Definición de las columnas de la tabla
    columns: {
        // Clave primaria autoincremental
        id_asignacion: {
            primary: true,
            type: 'int',
            generated: true,
        },

        // Fecha en la que se realizó la asignación
        fecha_asignada: {
            type: 'date',
            nullable: false,
        },

        // Llave foránea que referencia al servicio (Agenda)
        id_servicio: {
            type: 'int',
            nullable: false,
        },

        // Llave foránea que referencia al trabajador asignado
        id_trabajador: {
            type: 'int',
            nullable: false,
        },

        // Llave foránea que referencia al usuario (coordinador)
        // que realizó la asignación
        id_usuario: {
            type: 'int',
            nullable: false,
        },

        // Descripción de la tarea o instrucciones para el trabajador.
        // Es nullable porque existen registros antiguos que no poseen este campo.
        descripcion: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
    },

    // Relaciones con otras entidades
    relations: {

        // Muchas asignaciones pueden pertenecer a un mismo servicio.
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio' },
            inverseSide: 'asignar_servicio',
        },

        // Muchas asignaciones pueden corresponder a un mismo trabajador.
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador' },
            inverseSide: 'asignar_servicio',
        },

        // Usuario (coordinador) que realizó la asignación.
        // Un usuario puede crear múltiples asignaciones.
        usuario: {
            target: 'Usuario',
            type: 'many-to-one',
            joinColumn: { name: 'id_usuario' },
            inverseSide: 'asignaciones_servicio',
        },

        // Una asignación puede contener varias tareas asociadas.
        tareas: {
            target: 'Tarea',
            type: 'one-to-many',
            inverseSide: 'asignacion_servicio',
        },
    },
});