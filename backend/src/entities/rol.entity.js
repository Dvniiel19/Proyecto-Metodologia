"use strict";
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Rol',
    tableName: 'roles',
    columns: {
        id_rol: {
            primary: true,
            type: 'int',
            generated: true,
        },
        nombre_rol: {
            type: 'varchar',
            length: 255,
            unique: true,
            nullable: false,
        },
    },
    relations: {
        usuario: {
            target: 'Usuario', 
            type: 'one-to-many', // de un rol a muchos usuarios
            inverseSide: 'rol' 
        },
    },
});