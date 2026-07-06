"use strict";
const { EntitySchema } = require ('typeorm');

module.exports = new EntitySchema({
    name: 'ValidacionSupervisor',
    tableName: 'validacion_supervisor',
    columns: {
        id_validacion: {
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
        id_servicio: {
            type: 'int',
            nullable: false,
        },
        id_usuario: {
            type: 'int',
            nullable: false,
        },
    },  
    
    relations: {
        agenda: {
            target: 'Agenda',
            type: 'many-to-one', 
            joinColumn: { name: 'id_servicio' }, 
            inverseSide: 'validacion_supervisor',
        },
        usuario: { 
            target: 'Usuario',
            type: 'many-to-one', 
            joinColumn: { name: 'id_usuario' }, 
            inverseSide: 'validacion_supervisor',
        },
    },
});
