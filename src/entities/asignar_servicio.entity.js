"use strict";

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
    },
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
    },
    
});

//falta relacionarla con servicio, trabajador, coordinador(usuario)