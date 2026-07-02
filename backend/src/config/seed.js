require('dotenv').config({ path: './src/.env' });
require('reflect-metadata');
const bcrypt = require('bcryptjs');
const AppDataSource = require('./db');
const Rol = require('../entities/rol.entity');
const Usuario = require('../entitfies/usuario.entity');

const ROLES = [
  { nombre_rol: 'Administrador' },
  { nombre_rol: 'Coordinador' },
  { nombre_rol: 'Supervisor' },
  { nombre_rol: 'GestorInventario' },
  { nombre_rol: 'Trabajador de Aseo' },
];

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log(' Conectado a la base de datos');

    const rolRepository = AppDataSource.getRepository(Rol);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const rolesCreados = [];
    for (const rolData of ROLES) {
      const existente = await rolRepository.findOneBy({ nombre_rol: rolData.nombre_rol });
      if (existente) {
        console.log(` El rol "${rolData.nombre_rol}" ya existe (id: ${existente.id_rol})`);
        rolesCreados.push(existente);
      } else {
        const nuevoRol = rolRepository.create(rolData);
        const guardado = await rolRepository.save(nuevoRol);
        console.log(` Rol "${guardado.nombre_rol}" creado (id: ${guardado.id_rol})`);
        rolesCreados.push(guardado);
      }
    }

    const adminRol = rolesCreados.find(r => r.nombre_rol === 'Administrador');
    const trabajadorRol = rolesCreados.find(r => r.nombre_rol === 'Trabajador de Aseo');

    const usuariosSeed = [
      {
        correo: 'admin@ejemplo.com',
        contrasena: 'Admin123!',
        id_rol: adminRol.id_rol,
      },
      {
        correo: 'trabajador@ejemplo.com',
        contrasena: 'Trabajador1!',
        id_rol: trabajadorRol.id_rol,
      },
    ];

    for (const usuarioData of usuariosSeed) {
      const existente = await usuarioRepository.findOneBy({ correo: usuarioData.correo });
      if (existente) {
        console.log(` Usuario "${usuarioData.correo}" ya existe (id: ${existente.id_usuario})`);
      } else {
        const hash = await bcrypt.hash(usuarioData.contrasena, 10);
        const nuevoUsuario = usuarioRepository.create({
          correo: usuarioData.correo,
          contrasena: hash,
          id_rol: usuarioData.id_rol,
        });
        const guardado = await usuarioRepository.save(nuevoUsuario);
        console.log(` Usuario "${guardado.correo}" creado (id: ${guardado.id_usuario}, rol: ${usuarioData.id_rol})`);
      }
    }

    console.log('\n Seed completado exitosamente');
    console.log('  Admin:      admin@ejemplo.com / Admin123!');
    console.log('  Trabajador: trabajador@ejemplo.com / Trabajador1!');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error(' Error en seed:', error);
    process.exit(1);
  }
};

seed();
