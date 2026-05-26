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
    },
});

//falta relacionarla con la tabla rol 