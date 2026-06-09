require('reflect-metadata');
const db = require('./src/config/db');
const { encrypt } = require('./src/utils/bcryptUtils');

const Rol = require('./src/entities/rol.entity');
const Usuario = require('./src/entities/usuario.entity');
const Trabajador = require('./src/entities/trabajador.entity');
const Cliente = require('./src/entities/cliente.entity');
const Establecimiento = require('./src/entities/establecimiento.entity');
const Contrato = require('./src/entities/contrato.entity');
const Agenda = require('./src/entities/agenda.entity');
const AsignarServicio = require('./src/entities/asignarServicio.entity');
const Asistencia = require('./src/entities/asistencia.entity');
const Tarea = require('./src/entities/tarea.entity');
const Checklist = require('./src/entities/checklist.entity');
const ValidacionSupervisor = require('./src/entities/validacionSupervisor.entity');
const EvaluacionFinal = require('./src/entities/evaluacionFinal.entity');
const Insumo = require('./src/entities/insumos.entity');
const ConsumoInsumo = require('./src/entities/consumoInsumo.entity');
const Transaccion = require('./src/entities/transacciones.entity');
const Notificacion = require('./src/entities/notificacion.entity');

const seedDatabase = async () => {
    try {
        await db.initialize();
        console.log('✅ Base de datos conectada. Iniciando poblado (5 registros por entidad)...');

        const repos = {
            rol: db.getRepository(Rol),
            usuario: db.getRepository(Usuario),
            trabajador: db.getRepository(Trabajador),
            cliente: db.getRepository(Cliente),
            establecimiento: db.getRepository(Establecimiento),
            contrato: db.getRepository(Contrato),
            agenda: db.getRepository(Agenda),
            asignar: db.getRepository(AsignarServicio),
            asistencia: db.getRepository(Asistencia),
            tarea: db.getRepository(Tarea),
            checklist: db.getRepository(Checklist),
            validacion: db.getRepository(ValidacionSupervisor),
            evaluacion: db.getRepository(EvaluacionFinal),
            insumo: db.getRepository(Insumo),
            consumo: db.getRepository(ConsumoInsumo),
            transaccion: db.getRepository(Transaccion),
            notificacion: db.getRepository(Notificacion),
        };

        // 1. Roles (5)
        const roles = await repos.rol.save([
            { nombre_rol: 'Administrador' },
            { nombre_rol: 'Supervisor' },
            { nombre_rol: 'Operario' },
            { nombre_rol: 'Cliente' },
            { nombre_rol: 'Auditor' }
        ]);
        console.log('✅ 5 Roles creados');

        // 2. Usuarios (Creamos 15 para evitar choques de llaves foráneas 1 a 1 entre Trabajador y Cliente)
        const password = await encrypt('Password123!');
        const usersData = [];
        for(let i=1; i<=15; i++) {
            usersData.push({ 
                correo: `user${i}@limpieza.com`, 
                contrasena: password, 
                rol: roles[i % 5] 
            });
        }
        const usuarios = await repos.usuario.save(usersData);
        console.log('✅ Usuarios base creados (15 registros para asignar)');

        // 3. Trabajadores (5)
        const trabajadoresData = [];
        for(let i=0; i<5; i++) {
            trabajadoresData.push({
                nombre: `Trabajador ${i+1}`,
                apellido: `Apellido ${i+1}`,
                telefono: `+5691000000${i}`,
                usuario: usuarios[i] // Usa usuarios del 0 al 4
            });
        }
        const trabajadores = await repos.trabajador.save(trabajadoresData);
        console.log('✅ 5 Trabajadores creados');

        // 4. Clientes (5)
        const clientesData = [];
        for(let i=0; i<5; i++) {
            clientesData.push({
                nombre: `Empresa ${i+1} SA`,
                apellido: `Representante ${i+1}`,
                telefono: `+5692000000${i}`,
                historial_servicios: `Historial de prueba ${i+1}`,
                usuario: usuarios[i+5] // Usa usuarios del 5 al 9
            });
        }
        const clientes = await repos.cliente.save(clientesData);
        console.log('✅ 5 Clientes creados');

        // 5. Establecimientos (5)
        const establecimientosData = [];
        for(let i=0; i<5; i++) {
            establecimientosData.push({
                direccion: `Calle Falsa ${123 + i}, Ciudad`,
                tipo: i % 2 === 0 ? 'Oficina' : 'Bodega',
                cliente: clientes[i]
            });
        }
        const establecimientos = await repos.establecimiento.save(establecimientosData);
        console.log('✅ 5 Establecimientos creados');

        // 6. Contratos (5)
        const contratosData = [];
        for(let i=0; i<5; i++) {
            contratosData.push({
                fecha_inicio: `2026-0${1+i}-01`,
                fecha_fin: `2026-12-31`,
                precio: 100000 * (i+1),
                cliente: clientes[i]
            });
        }
        const contratos = await repos.contrato.save(contratosData);
        console.log('✅ 5 Contratos creados');

        // 7. Agendas / Servicios (5)
        const agendasData = [];
        for(let i=0; i<5; i++) {
            agendasData.push({
                fecha_programada: `2026-06-1${i}`,
                hora_inicio: `08:0${i}:00`,
                hora_fin: `12:0${i}:00`,
                estado: 'Programado',
                establecimiento: establecimientos[i],
                contrato: contratos[i]
            });
        }
        const agendas = await repos.agenda.save(agendasData);
        console.log('✅ 5 Agendas creadas');

        // 8. Asignar Servicio (5)
        const asignacionesData = [];
        for(let i=0; i<5; i++) {
            asignacionesData.push({
                fecha_asignada: `2026-06-0${i+1}`,
                agenda: agendas[i],
                trabajador: trabajadores[i],
                usuario: usuarios[10] // Asume que el usuario 10 es Supervisor
            });
        }
        await repos.asignar.save(asignacionesData);
        console.log('✅ 5 Servicios Asignados');

        // 9. Tareas (5)
        const tareas = await repos.tarea.save([
            { descripcion: 'Limpieza de pisos y aspirado' },
            { descripcion: 'Limpieza de ventanales' },
            { descripcion: 'Desinfección de baños' },
            { descripcion: 'Retiro de basura' },
            { descripcion: 'Limpieza de escritorios' }
        ]);
        console.log('✅ 5 Tareas creadas');

        // 10. Insumos (5)
        const insumos = await repos.insumo.save([
            { nombre_insumo: 'Detergente Industrial', stock: 50 },
            { nombre_insumo: 'Cloro', stock: 30 },
            { nombre_insumo: 'Bolsas de basura', stock: 100 },
            { nombre_insumo: 'Limpiavidrios', stock: 40 },
            { nombre_insumo: 'Desinfectante', stock: 60 }
        ]);
        console.log('✅ 5 Insumos creados');

        // 11. Asistencias (5)
        const asistenciasData = [];
        for(let i=0; i<5; i++) {
            asistenciasData.push({
                hora_entrada: `07:5${i}:00`,
                hora_salida: `12:0${i}:00`,
                trabajador: trabajadores[i],
                agenda: agendas[i]
            });
        }
        await repos.asistencia.save(asistenciasData);
        console.log('✅ 5 Asistencias registradas');

        // 12. Checklist (5)
        const checklistData = [];
        for(let i=0; i<5; i++) {
            checklistData.push({
                completado: true,
                foto_servicio: `https://ejemplo.com/foto${i}.jpg`,
                agenda: agendas[i],
                tarea: tareas[i]
            });
        }
        await repos.checklist.save(checklistData);
        console.log('✅ 5 Checklists completados');

        // 13. Consumo de Insumos (5)
        const consumoData = [];
        for(let i=0; i<5; i++) {
            consumoData.push({
                cantidad_utilizada: i + 1,
                insumo: insumos[i],
                agenda: agendas[i]
            });
        }
        await repos.consumo.save(consumoData);
        console.log('✅ 5 Consumos de Insumos registrados');

        // 14. Validación Supervisor (5)
        const validacionData = [];
        for(let i=0; i<5; i++) {
            validacionData.push({
                estado_aprobacion: 'completo',
                observaciones: `Todo en orden servicio ${i+1}`,
                agenda: agendas[i],
                usuario: usuarios[10] // Supervisor
            });
        }
        await repos.validacion.save(validacionData);
        console.log('✅ 5 Validaciones de supervisor registradas');

        // 15. Evaluación Final (5)
        const evaluacionData = [];
        for(let i=0; i<5; i++) {
            evaluacionData.push({
                nota: 5,
                comentarios: `Buen servicio ${i+1}`,
                agenda: agendas[i]
            });
        }
        await repos.evaluacion.save(evaluacionData);
        console.log('✅ 5 Evaluaciones finales registradas');

        // 16. Transacciones (5)
        const transaccionesData = [];
        for(let i=0; i<5; i++) {
            transaccionesData.push({
                tipo_transaccion: 'Pago mensual',
                monto: 100000 * (i+1),
                fecha_emision: `2026-06-01`,
                fecha_pago: `2026-06-0${i+2}`,
                estado_pago: 'Pagado',
                contrato: contratos[i]
            });
        }
        await repos.transaccion.save(transaccionesData);
        console.log('✅ 5 Transacciones registradas');

        // 17. Notificaciones (5)
        const notificacionesData = [];
        for(let i=0; i<5; i++) {
            notificacionesData.push({
                mensaje: `Notificación de prueba ${i+1}`,
                leida: false,
                trabajador: trabajadores[i]
            });
        }
        await repos.notificacion.save(notificacionesData);
        console.log('✅ 5 Notificaciones enviadas');

        console.log('🎉 ¡Base de datos poblada exitosamente con 5 registros por entidad!');
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
    } finally {
        await db.destroy();
        console.log('🚪 Conexión cerrada.');
    }
};

seedDatabase();