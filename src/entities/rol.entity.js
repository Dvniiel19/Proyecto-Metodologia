"use strict";
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'roles',
  tableName: 'rol',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
    },
  },
});