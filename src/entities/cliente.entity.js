"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Cliente',
    tableName: 'clientes',
    columns: {
        id_cliente: {
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
            nullable: false
        },
        telefono: {
            type: 'varchar',
            length: 20,
            nullable: false,
        },
        historial_servicios: {
            type: 'text',
            nullable: true,
        },
    },
    relations: {
        usuario: {
            target: 'Usuario',
            type: 'one-to-one',
            joinColumn: { name: 'id_usuario'},
            inverseSide: 'clientes',
        },
        contrato: {
            target: 'Contrato',
            type: 'one-to-many',
            inverseSide: 'clientes',
        },
        establecimientos: {
            target: 'Establecimiento',
            type: 'one-to-many',
            inverseSide: 'clientes',
        },
    },
    
});

//falta relacionar con la tabla usuario
