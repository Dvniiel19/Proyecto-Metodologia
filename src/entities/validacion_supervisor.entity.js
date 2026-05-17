"use strict";

const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'ValicacionSupervisor',
    tableName: 'validacion_supervisor',
    columns: {
        id_valicacion: {
            primary: true,
            type:'int',
            generated: true,
        },
        estado_aprobacion: {
            type: 'varchar',
            length: 50,
            nullable: false,
        },
        observaciones: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
    },  
});

//relacionar con agenda y usuario