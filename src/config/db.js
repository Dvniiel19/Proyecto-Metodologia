const { DataSource } = require('typeorm');
// require('dotenv').config();
require('dotenv').config({ path: './src/.env' });

// importar todas las entidades
const Rol = require('../entities/rol.entity');
const Usuario = require('../entities/usuario.entity');
const Trabajador = require('../entities/trabajador.entity');
const Cliente = require('../entities/cliente.entity');
const Establecimiento = require('../entities/establecimiento.entity');
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
const Transaccion = require('../entities/transacciones.entity')
const Notificacion = require('../entities/notificacion.entity');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Utilizamos la URL completa que nos da Supabase
  ssl: { 
    rejectUnauthorized: false // REQUERIDO para conectarse a Supabase desde fuera de su red
  },
  synchronize: false, // Crea automáticamente las tablas en base a las entidades
  logging: false,
  entities: [ 
    Agenda, AsignarServicio, Asistencia, ConsumoInsumo, Contrato, Establecimiento, EvaluacionFinal,
    Insumo, Rol, Tarea, Trabajador, Transaccion, Usuario, Checklist, Cliente, Notificacion, ValidacionSupervisor
  ],
});

module.exports = AppDataSource;