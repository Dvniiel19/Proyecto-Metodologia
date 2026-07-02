require('reflect-metadata');
const AppDataSource = require('./db');

const initialSetup = async () => {
  try {
    console.log('🔄 Iniciando configuración inicial...');
    
    // Al inicializar, TypeORM sincroniza automáticamente las entidades de db.js
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida y tablas sincronizadas con éxito.');

    // Cerramos la conexión si este es un script independiente que ejecutas una sola vez
    await AppDataSource.destroy();
    console.log('🚪 Conexión de configuración cerrada.');

  } catch (error) {
    console.error('❌ Error durante la configuración inicial:', error);
    process.exit(1);
  }
};

initialSetup();