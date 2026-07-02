"use strict"; 

/**
 * Entidad ConsumoInsumo: historico de movimientos de inventario.
 * Cada fila registra cuanto de un insumo se uso (o ingreso) en una jornada,
 * con tipo de movimiento, observaciones y fecha automatica.
 */
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'ConsumoInsumo',
    tableName: 'consumo_insumo',
    columns: {
        id_consumo: {
            primary: true,
            type: 'int',
            generated: true,
        },
        cantidad_utilizada: {
            type: 'int',
            nullable: false,
        },
        // Columnas que registra el flujo de movimientos (/insumos/movimiento).
        // Sin ellas TypeORM las ignoraba al guardar y el historico fallaba al ordenar por fecha_emision.
        tipo_movimiento: {
            type: 'varchar',
            length: 20,
            nullable: true, // 'ingreso' o 'salida'; null en consumos creados por el CRUD directo
        },
        observaciones: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        fecha_emision: {
            type: 'timestamp',
            createDate: true, // se completa automaticamente al crear el registro
        },
        id_insumo: {
            type: 'int',
            nullable: false,
        },
        id_servicio: {
            type: 'int',
            nullable: false,
        },
    },
    // Relaciones con otras tablas: TypeORM las usa para hacer los JOIN
    // cuando un service pide datos con "relations"
    relations: {
        insumo: {
            target: 'Insumo',
            type: 'many-to-one',
            joinColumn: { name: 'id_insumo'},
            inverseSide: 'consumo_insumo',
        },
        agenda: {
            target: 'Agenda',
            type: 'many-to-one',
            joinColumn: { name: 'id_servicio'},
            inverseSide: 'consumo_insumo', 
        },
    },
});
