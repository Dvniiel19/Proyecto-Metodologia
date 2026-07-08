// Ejecuta un archivo .sql contra la base de datos del proyecto (DATABASE_URL).
// Uso: node migrations/run-migration.js migrations/<archivo>.sql
'use strict';
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../src/.env') });

const archivo = process.argv[2];
if (!archivo) {
  console.error('Uso: node migrations/run-migration.js <ruta-al-archivo.sql>');
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve(archivo), 'utf8');

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // igual que src/config/db.js (Supabase)
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log(`Migracion aplicada correctamente: ${archivo}`);
  } catch (err) {
    console.error('Error al aplicar la migracion:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
