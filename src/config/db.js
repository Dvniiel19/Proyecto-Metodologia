const { DataSource } = require('typeorm');
require('dotenv').config();

//importar todas las entidades
const Rol = require('../entities/rol.entity');
const Usuario = require('../entities/usuario.entity');
const Trabajador = require('../entities/trabajador.entity');
const Cliente = require('../entities/cliente.entity');
const Establecimiento = require('../entities/establecimiento.entity');
const Contrato = require('../entities/contrato.entity');
const Agenda = require('../entities/agenda.entity');
const AsignarServicio = require('../entities/asignar_servicio.entity');
const Asistencia = require('../entities/asistencia.entity');
const Tarea = require('../entities/tarea.entity');
const Checklist = require('../entities/checklist.entity');
const ValidacionSupervisor = require('../entities/validacion_supervisor.entity');
const EvaluacionFinal = require('../entities/evaluacion_final.entity');
const ConsumoInsumo = require('../entities/consumo_insumo.entity');
const Insumo = require('../entities/insumos.entity');
const Transaccion = require('../entities/transacciones.entity')

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'daniel',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DATABASE || 'servicio_aseo',
  synchronize: true, // Crea automáticamente las tablas en base a las entidades
  logging: false,
  entities: 
  [ Agenda, AsignarServicio, Asistencia, ConsumoInsumo, Contrato, Establecimiento, EvaluacionFinal,
    Insumo, Rol, Tarea, Trabajador, Transaccion, Usuario, Checklist, Cliente
  ],
});

module.exports = AppDataSource;