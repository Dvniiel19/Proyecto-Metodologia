require('reflect-metadata');

/**
 * punto de entrada de la aplicacion
 * inicia el servidor express
 */

const express = require('express');
const config = require('./config/config');
const db = require('./config/db');

const app = express();

//middlewaares

app.use(express.json()); //entiende los datos k llegan a formato json

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
const asignarServicioRoutes = require('./routes/asignar_ServicioRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const establecimientoRoutes = require('./routes/establecimientoRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const establecimientoRoutes = require('./routes/establecimientoRoutes');
const trabajadorRoutes = require('./routes/trabajadorRoutes');

app.use('/asignarServicio', asignarServicioRoutes);
app.use('/contrato', contratoRoutes);
app.use('/rol', rolRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/agenda', agendaRoutes);
app.use('/cliente', clienteRoutes);
app.use('/checklist', checklistRoutes);
app.use('/tarea', tareaRoutes);
app.use('/insumos', insumosRoutes);
app.use('/establecimiento', establecimientoRoutes);
app.use('/trabajador', trabajadorRoutes);

app.use((req,res)=> {
    res.status(404).json({
        success: false,
        mensaje: 'ruta no encontrada'

    });
});

// Iniciar servidor ayudantia
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