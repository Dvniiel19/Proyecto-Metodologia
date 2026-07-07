"use strict";
const { EntitySchema } = require ('typeorm');

/**
 * MODELO RELACIONAL DE LA EVALUACION
 * La nota del cliente califica al SERVICIO (Agenda), no a un trabajador puntual:
 * un servicio puede tener varios trabajadores y todos comparten la calificacion.
 *
 *   EvaluacionFinal 1—1 Agenda 1—N AsignarServicio N—1 Trabajador
 *
 * asignar_servicio ya es la tabla de union entre el servicio y sus trabajadores,
 * por lo que el historial de notas de un trabajador se obtiene por JOIN
 * (ver reportesService.obtenerRendimientoTrabajadores) sin duplicar datos.
 */
module.exports = new EntitySchema({
    name: 'EvaluacionFinal',
    tableName: 'evaluacion_final',
    columns: {
        id_evaluacion: {
            primary: true,
            type: 'int',
            generated: true,
        },
        nota: {
            type: 'int', //entero porque va a ser de 1-5
            nullable: false,
        },
        comentarios: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        id_servicio: { // para relacionar la evaluacion con el servicio que se esta evaluando
            type: 'int',
            nullable: false,
        },
        // DEPRECADO: se conserva solo por las evaluaciones antiguas que
        // atribuian la nota a un unico trabajador. Las evaluaciones nuevas
        // dejan este campo en null; los trabajadores involucrados se derivan
        // de asignar_servicio.
        id_trabajador: {
            type: 'int',
            nullable: true,
        },
    },
    uniques: [ // para asegurar que cada servicio tenga solo una evaluacion final
        {
            name: 'UQ_EVALUACION_SERVICIO', // nombre de la restriccion de unicidad
            columns: ['id_servicio'],
        },
    ],
    
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'one-to-one',
            joinColumn: { name: 'id_servicio' },
        },
        trabajador: {
            target: 'Trabajador',
            type: 'many-to-one',
            joinColumn: { name: 'id_trabajador' },
            inverseSide: 'evaluaciones',
        },
    },
});
