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
            unique: true,
            nullable: false,
        },
        contrasena: {
            type: 'varchar',
            length: 255,
            nullable: false,
            select: false,
        },
        id_rol: {
            type: 'int',
            nullable: false,
        },
       
        fecha_expiracion: {
            type: 'timestamp',
            nullable: true,
        },
        estado_rol: {
            type: 'varchar',
            length: 255,
            default: 'Activo',
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