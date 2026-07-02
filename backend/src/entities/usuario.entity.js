"use strict";

/**
 * Entidad Usuario: credenciales de acceso al sistema (correo + contrasena hasheada).
 * La contrasena tiene select: false para que ninguna consulta la exponga por accidente.
 * Un usuario puede ser trabajador o cliente segun su rol.
 */
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
            nullable: false, //para que no se puedan dejar vacios
        },
        contrasena: {
            type: 'varchar',
            length: 255,
            nullable: false, //para que no se puedan dejar vacios
            select: false, // el hash no se devuelve en las consultas; solo el login lo pide explicitamente
        },
        id_rol: {
            type: 'int',
            nullable: false,
        },
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
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
