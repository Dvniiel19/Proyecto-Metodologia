"use strict";
/**
 * Entidad Rol: roles del sistema (Administrador, Supervisor, Coordinador,
 * Trabajador, Cliente, GestorInventario). El nombre del rol viaja dentro del JWT
 * y las rutas lo usan para autorizar el acceso.
 */
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
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
    relations: {
        usuario: {
            target: 'Usuario', 
            type: 'one-to-many', // de un rol a muchos usuarios
            inverseSide: 'rol' 
        },
    },
});