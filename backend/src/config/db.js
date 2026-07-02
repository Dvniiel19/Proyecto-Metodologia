const { DataSource } = require('typeorm');
// require('dotenv').config();
require('dotenv').config({ path: './src/.env' });

// importar todas las entidades
const Rol = require('../entities/rol.entity');
const Usuario = require('../entities/usuario.entity');
const Trabajador = require('../entities/trabajador.entity');
const Cliente = require('../entities/cliente.entity');
const Contrato = require('../entities/contrato.entity');
const Agenda = require('../entities/agenda.entity');
const AsignarServicio = require('../entities/asignarServicio.entity');
const Asistencia = require('../entities/asistencia.entity');
const Tarea = require('../entities/tarea.entity');
const Checklist = require('../entities/checklist.entity');
const ValidacionSupervisor = require('../entities/validacionSupervisor.entity');
const EvaluacionFinal = require('../entities/evaluacionFinal.entity');
const ConsumoInsumo = require('../entities/consumoInsumo.entity');
const Insumo = require('../entities/insumos.entity');
const Notificacion = require('../entities/notificacion.entity');

// DataSource: el punto unico de conexion a la base de datos con TypeORM.
// Todos los services obtienen sus repositorios desde aqui con db.getRepository(Entidad)
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Utilizamos la URL completa que nos da Supabase
  ssl: {
    rejectUnauthorized: false // REQUERIDO para conectarse a Supabase desde fuera de su red
  },
  synchronize: true, // Crea automaticamente las tablas en base a las entidades (solo para desarrollo: en produccion puede alterar tablas con datos)
  logging: false, // en true muestra en consola cada SQL que ejecuta TypeORM (util para depurar)
  entities: [
    Agenda, AsignarServicio, Asistencia, ConsumoInsumo, Contrato, EvaluacionFinal,
    Insumo, Rol, Tarea, Trabajador, Usuario, Checklist, Cliente, Notificacion, ValidacionSupervisor
  ],
});

module.exports = AppDataSource;