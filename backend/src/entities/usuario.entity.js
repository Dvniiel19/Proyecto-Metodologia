"use strict";

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Usuario',
    tableName: 'usuarios',
    columns: {
        id_usuario: {
            primary: true,
            type: 'int',
            generated: true,
        },
        correo: {
            type: 'varchar',
            length: 255,
            unique: true, //para evitar correos duplicados
            nullable: false, //para que no se puedan dejar vacíos
        },
        contrasena: {
            type: 'varchar',
            length: 255,
            nullable: false, //para que no se puedan dejar vacíos   
        },
        id_rol: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        rol: {
            target: 'Rol',
            type: 'many-to-one',
            joinColumn: { name: 'id_rol'}, 
            inverseSide: 'usuario',
        },
        trabajador: {
            target: 'Trabajador',
            type: 'one-to-one',
            inverseSide: 'usuario',
        },
        cliente: {
            target: 'Cliente',
            type: 'one-to-one',
            inverseSide: 'usuario',
        },
        asignar_servicio: {
            target: 'AsignarServicio',
            type: 'one-to-many',
            inverseSide: 'usuario',
        },
    },
});
