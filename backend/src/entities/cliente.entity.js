"use strict";

/**
 * Entidad Cliente: datos de contacto del cliente. Se enlaza 1 a 1 con un Usuario
 * (que guarda sus credenciales de acceso) y puede tener varios contratos.
 */
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Cliente',
    tableName: 'cliente',
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
        direccion: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        id_usuario: {
            type: 'int',
            nullable: true,
        },
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
    relations: {
        usuario: {
            target: 'Usuario',
            type: 'one-to-one',
            joinColumn: { name: 'id_usuario'},
            inverseSide: 'cliente',
        },
        contrato: {
            target: 'Contrato',
            type: 'one-to-many',
            inverseSide: 'cliente',
        },
    },
    
});
