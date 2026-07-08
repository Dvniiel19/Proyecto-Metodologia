"use strict";

const { EntitySchema } = require('typeorm');

// Esquema de la entidad Asistencia.
// Almacena el registro de asistencia de los trabajadores para cada servicio.
module.exports = new EntitySchema({
    name: 'Asistencia',
    tableName: 'asistencia',

    // Definición de las columnas de la tabla
    columns: {
        // Clave primaria autoincremental
        id_asistencia: {
            primary: true,
            type: 'int',
            generated: true,
        },

        // Fecha en la que se registra la asistencia.
        // Por defecto toma la fecha actual.
        fecha: {
            type: 'date',
            nullable: false,
            default: () => 'CURRENT_DATE',
        },

        // hora de ingreso del trabajador.
        // es nullable porque una inasistencia (estado "Ausente")
        // no tiene hora de entrada.
        hora_entrada: {
            type: 'time',
            nullable: true,
        },

        // estado de la asistencia.
        // permite distinguir entre un trabajador presente
        // y una ausencia registrada manualmente.
        estado_asistencia: {
            type: 'varchar',
            length: 20,
            nullable: false,
            default: 'Presente',
        },

        // hora de salida del trabajador.
        // puede quedar vacía mientras el trabajador
        // aún no finaliza su jornada.
        hora_salida: {
            type: 'time',
            nullable: true,
        },

        // llave foránea que identifica al trabajador.
        id_trabajador: {
            type: 'int',
            nullable: false,
        },

        // llave foránea que identifica el servicio asociado.
        id_servicio: {
            type: 'int',
            nullable: false,
        },
    },

    // relaciones con otras entidades
    relations: {

        // muchas asistencias pueden pertenecer a un mismo trabajador.
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador' },
            inverseSide: 'asistencia',
        },

        // muchas asistencias pueden corresponder a un mismo servicio.
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio' },
            inverseSide: 'asistencia',
        },
    },
});