// Punto de entrada del backend: configura Express (CORS, JSON, archivos
// estaticos), monta las rutas de cada modulo, conecta la BD con TypeORM
// y levanta el cron de expiracion de roles.
require('dotenv').config(); // carga las variables de entorno del .env
require('reflect-metadata'); // requerido por TypeORM para leer los metadatos de las entidades

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/db');
const { iniciarVerificacionRoles } = require('./utils/expiracionCron');

// Importamos el archivo de manera segura
const autorizacionMiddleware = require('./middlewares/autorizacionMiddleware');

const app = express();

// Solo se aceptan peticiones desde el frontend en desarrollo (Vite usa 5173/5174)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json()); // parsea el body JSON de todas las peticiones

// Middleware global: normaliza cualquier fecha del body a formato local
// YYYY-MM-DD antes de llegar a los controladores (evita corrimientos por zona horaria)
const { normalizarFechasBody } = require('./utils/fechas');
app.use((req, res, next) => {
  if (req.body) normalizarFechasBody(req.body);
  next();
});

// Sirve las fotos de evidencia como archivos estaticos (ej: /uploads/evidencias/tarea-123.jpg)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido al backend de usuarios',
    version: '1.0.0'
  });
});

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
const reportesRoutes = require('./routes/reportesRoutes');

// /auth va ANTES del middleware de verificacion de rol: el login debe ser
// accesible sin token (si no, nadie podria autenticarse)
app.use('/auth', authRoutes);

// A partir de aqui, toda ruta pasa por verificarEstadoRol: si el rol del
// usuario expiro, la peticion se bloquea con 403 sin llegar al controlador.
// === CONTROL SEGURO DE MIDDLEWARE PARA EVITAR CAÍDAS DE EXPRESS ===
if (typeof autorizacionMiddleware === 'function') {
    app.use(autorizacionMiddleware);
} else if (autorizacionMiddleware && typeof autorizacionMiddleware.verificarEstadoRol === 'function') {
    app.use(autorizacionMiddleware.verificarEstadoRol);
} else {
    // Si el archivo está vacío o los nombres dentro no coinciden, esto evita que el servidor explote
    app.use((req, res, next) => next());
}

app.use('/asignarServicio', asignarServicioRoutes);
app.use('/contrato', contratoRoutes);
app.use('/rol', rolRoutes);
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
app.use('/reportes', reportesRoutes);

// Catch-all: cualquier ruta no registrada responde 404 en formato JSON estandar
app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: 'ruta no encontrada'
    });
});

// El servidor solo se levanta si la conexion a la BD fue exitosa;
// asi se evita atender peticiones sin base de datos disponible
db.initialize()
    .then(() => {
        console.log('✅ Base de datos conectada con TypeORM');
       
        iniciarVerificacionRoles();

        app.listen(config.PORT, () => {
            console.log(`✅ Servidor ejecutándose en puerto ${config.PORT}`);
            console.log(`🔗 http://localhost:${config.PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al conectar la base de datos:', error);
    });