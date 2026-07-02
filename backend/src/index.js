require('dotenv').config(); // <-- ESTO VA AQUI, EN LA LINEA 1 DEL INDEX.JS


require('reflect-metadata');

/**
 * punto de entrada de la aplicacion
 * inicia el servidor express
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/db');

const app = express();

// [AGREGADO] CORS para permitir peticiones desde el frontend en desarrollo (puertos 5173 y 5174).
// En produccion se debe cambiar origin por el dominio real del frontend.
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json()); // parsea el body JSON de las peticiones y lo deja en req.body
// Sirve las fotos de evidencia como archivos estaticos: /uploads/evidencias/<archivo>
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//RUTAS 'falta terminar too lo otro'

//ruta prueba 

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido al backend de usuarios',
    version: '1.0.0'
  });
});

// manejo de rutas no encontradas
const clienteRoutes = require('./routes/clienteRoutes');
const contratoRoutes = require('./routes/contratoRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const insumosRoutes = require('./routes/insumosRoutes');
const asignarServicioRoutes = require('./routes/asignarServicioRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const consumoInsumoRoutes = require('./routes/consumoInsumoRoutes');
const evaluacionFinalRoutes = require('./routes/evaluacionFinalRoutes');
const validacionSupervisorRoutes = require('./routes/validacionSupervisorRoutes');
const trabajadorRoutes = require('./routes/trabajadorRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/asignarServicio', asignarServicioRoutes);
app.use('/contrato', contratoRoutes);
app.use('/rol', rolRoutes);
app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/agenda', agendaRoutes);
app.use('/cliente', clienteRoutes);
app.use('/checklist', checklistRoutes);
app.use('/tarea', tareaRoutes);
app.use('/insumos', insumosRoutes);
app.use('/asistencia', asistenciaRoutes);
app.use('/consumoInsumo', consumoInsumoRoutes);
app.use('/evaluacionFinal', evaluacionFinalRoutes);
app.use('/validacionSupervisor', validacionSupervisorRoutes);
app.use('/trabajador', trabajadorRoutes);
// Middleware final "atrapa-todo": si ninguna ruta anterior respondio,
// la peticion cae aqui y se responde 404. Debe ir despues de todas las rutas
app.use((req,res)=> {
    res.status(404).json({
        success: false,
        mensaje: 'ruta no encontrada'

    });
});

// Arranque en orden: primero se conecta la base de datos y SOLO si la conexion
// funciona se levanta el servidor HTTP. Asi no se aceptan peticiones sin DB
db.initialize()
  .then(() => {
    console.log('✅ Base de datos conectada con TypeORM');
    app.listen(config.PORT, () => {
      console.log(`✅ Servidor ejecutándose en puerto ${config.PORT}`);
      console.log(`🔗 http://localhost:${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error);
  });