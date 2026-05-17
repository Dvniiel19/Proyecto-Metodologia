/*const { DataSource } = require('typeorm');
require('dotenv').config();
const Usuario = require('../entities/Usuario');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'daniel',
  //password: process.env.DB_PASSWORD || 'password', no tengo contraseña 
  database: process.env.DATABASE || 'servicio_aseo',
  synchronize: true, // Auto-crear tablas (solo para desarrollo)
  logging: false,
  entities: [Usuario],
});

module.exports = AppDataSource;  */

/*
const { DataSource } = require('typeorm');
require('dotenv').config();

// Importación corregida con el nombre exacto de tu archivo
const Usuario = require('../entities/usuario.entity'); 

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'daniel',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DATABASE || 'servicio_aseo',
  synchronize: true, 
  logging: false,
  entities: [Usuario], // TypeORM ya sabe que debe buscar la clase dentro de ese archivo
});

module.exports = AppDataSource; */











const { DataSource } = require('typeorm');
require('dotenv').config();

// Importación de todas las entidades
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
  [ Agenda, AsignarServicio, Asistencia, Checklist, Cliente, Contrato, EvaluacionFinal, 
    Establecimiento,  Rol, Tarea, Trabajador, Usuario, ValidacionSupervisor ],
});

module.exports = AppDataSource;