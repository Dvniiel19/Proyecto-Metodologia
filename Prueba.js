const { Pool } = require('pg');

const connectionString = "postgresql://postgres.juvkqxmcnhkovyrcfwbo:gcoETPtPwggooLoS@aws-1-us-east-2.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function poblarBaseDeDatos() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('🔄 Conectado a Supabase. Insertando 10 registros por tabla...');

    const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync("123456", 10));

    
    // 2. INSUMOS
    const insumos = [
      ['Líquido Limpiador Industrial 5L', 20], ['Paños de Microfibra (Pack 10)', 15],
      ['Desengrasante Multiuso', 30], ['Alcohol Isopropílico 1L', 10],
      ['Guantes de Nitrilo (Caja 100)', 25], ['Limpiavidrios Concentrado', 12],
      ['Bolsas de Basura XL (Pack 50)', 40], ['Cera para Pisos 5L', 8],
      ['Cloro Gel 2L', 18], ['Esponjas Abrasivas (Pack 6)', 50]
    ];
    for (const [nombre, stock] of insumos) {
      await client.query('INSERT INTO insumos (nombre, stock) VALUES ($1, $2);', [nombre, stock]);
    }

    // 3. TAREAS
    const tareas = [
      'Limpieza de pisos y superficies', 'Desinfección de baños públicos',
      'Aspirado de alfombras y tapices', 'Limpieza de ventanales exteriores',
      'Revisión de puntos de red y cableado', 'Orden e higienización de bodegas',
      'Retiro de residuos y basura', 'Mantención de áreas verdes comunes',
      'Sanitización de puestos de trabajo', 'Lavado a presión de estacionamientos'
    ];
    for (const tarea of tareas) {
      await client.query('INSERT INTO tarea (nombre) VALUES ($1);', [tarea]);
    }

    // 4. VALIDACIÓN SUPERVISOR
    const validaciones = [
      ['Aprobado', 'Todo impecable, cumple con los estándares.'],
      ['Rechazado', 'Faltó repasar las esquinas en el sector norte.'],
      ['Aprobado', 'Validado sin contratiempos por el supervisor.'],
      ['Aprobado con observaciones', 'Detalle mínimo en ventanales, corregido en el momento.'],
      ['Rechazado', 'No se realizó la desinfección profunda acordada.'],
      ['Aprobado', 'Excelente nivel de pulido en piso flotante.'],
      ['Aprobado', 'Cumple a cabalidad con los protocolos de seguridad.'],
      ['Rechazado', 'Retraso en la entrega del checklist y falta firma.'],
      ['Aprobado', 'Entrega impecable, cliente conforme.'],
      ['Aprobado', 'Inspección final aprobada a primera hora.']
    ];
    for (const [estado, obs] of validaciones) {
      await client.query('INSERT INTO validacion_supervisor (estado_aprobacion, observaciones) VALUES ($1, $2);', [estado, obs]);
    }

    // 5. USUARIOS
    

    // 6. TRABAJADORES
    const trabajadores = [
      ['Pedro', 'González', '+56911112222', 3], ['Juan', 'Pérez', '+56922223333', 4],
      ['Diego', 'Muñoz', '+56933334444', 5], ['Luis', 'Soto', '+56944445555', 6],
      ['Carlos', 'Silva', '+56955556666', 7], ['Andrés', 'Castro', '+56966667777', null],
      ['Manuel', 'Contreras', '+56977778888', null], ['Jorge', 'Vergara', '+56988889999', null],
      ['Felipe', 'Molina', '+56999990000', null], ['Cristian', 'Rojas', '+56912345678', null]
    ];
    for (const [nom, ape, tel, usrFk] of trabajadores) {
      await client.query('INSERT INTO trabajador (nombre, apellido, telefono, id_usuario_fk) VALUES ($1, $2, $3, $4);', [nom, ape, tel, usrFk]);
    }

    // 7. CLIENTES
    const clientes = [
      ['Claudio', 'Aguilera', '+56933334444', 'Cliente prioritario regional.', 8],
      ['Ignacio', 'Vera', '+56955551111', 'Contrato corporativo sector educación.', 9],
      ['Javier', 'Fuentes', '+56977772222', 'Retail, alta demanda nocturna.', 10],
      ['Roberto', 'Sanhueza', '+56988883333', 'Sin observaciones.', null],
      ['María', 'Espinoza', '+56999994444', 'Atención solo días hábiles.', null],
      ['Fernanda', 'López', '+56911115555', 'Requiere control estricto de insumos.', null],
      ['Camila', 'Torres', '+56922226666', 'Edificio residencial.', null],
      ['Alejandro', 'Tapia', '+56933337777', 'Planta industrial.', null],
      ['Patricia', 'Araya', '+56944448888', 'Sucursal bancaria.', null],
      ['Gonzalo', 'Sepúlveda', '+56955559999', 'Servicio express de fin de semana.', null]
    ];
    for (const [nom, ape, tel, hist, usrFk] of clientes) {
      await client.query('INSERT INTO cliente (nombre, apellido, telefono, historial_servicio, id_usuario_fk) VALUES ($1, $2, $3, $4, $5);', [nom, ape, tel, hist, usrFk]);
    }

    // 8. ESTABLECIMIENTOS
    for (let i = 1; i <= 10; i++) {
      const comunas = ['Chillán', 'Quillón', 'Concepción', 'Bulnes', 'San Carlos', 'Los Ángeles', 'Talcahuano', 'Coronel', 'Penco', 'Tomé'];
      await client.query(
        'INSERT INTO establecimiento (direccion, tipo_establecimiento, id_cliente_fk) VALUES ($1, $2, $3);',
        [`Av. Libertad #${100 * i}, ${comunas[i-1]}`, i % 2 === 0 ? 'Oficina' : 'Planta Industrial', i]
      );
    }

    // 9. CONTRATOS
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO contrato (fecha_inicio, fecha_fin, precio, id_cliente_fk) VALUES ($1, $2, $3, $4);',
        ['2026-01-01', '2026-12-31', 500000.00 + (i * 50000), i]
      );
    }

    // 10. TRANSACCIONES
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO transacciones (tipo_transaccion, monto, fecha_emision, fecha_pago, estado_pago, id_contrato_fk) VALUES ($1, $2, $3, $4, $5, $6);',
        ['Transferencia', 500000.00 + (i * 50000), new Date('2026-05-01T09:00:00'), i % 2 === 0 ? new Date('2026-05-03T14:20:00') : null, i % 2 === 0 ? 'Pagado' : 'Pendiente', i]
      );
    }

    // 11. AGENDA
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO agenda (fecha_programada, estado_trabajo, id_establecimiento_fk, id_contrato_fk) VALUES ($1, $2, $3, $4);',
        [new Date(`2026-06-04T0${(i % 4) + 8}:00:00`), i % 3 === 0 ? 'En Proceso' : 'Completado', i, i]
      );
    }

    // 12. CHECKLIST (Corregido el cierre de comillas aquí)
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO checklist (estado, foto_servicio, id_agenda_fk, id_validacion_fk) VALUES ($1, $2, $3, $4);',
        ['Finalizado', `storage/fotos/srv_0${i}.jpg`, i, i]
      );
    }

    // 13. CONSUMO INSUMO
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO consumolnsumo (cantidad_utilizada, id_agenda_fk, id_insumo_fk) VALUES ($1, $2, $3);',
        [i + 1, i, i]
      );
    }

    // 14. ASIGNAR SERVICIO
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO asignar_servicio (fecha_asignada, id_trabajador_fk, id_agenda_fk) VALUES ($1, $2, $3);',
        [new Date('2026-06-04'), i, i]
      );
    }

    // 15. ASISTENCIA
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO asistencia (hora_entrada, hora_salida, id_trabajador_fk, id_agenda_fk) VALUES ($1, $2, $3, $4);',
        [new Date(`2026-06-04T0${(i % 3) + 7}:00:00`), new Date(`2026-06-04T13:00:00`), i, i]
      );
    }

    // 16. EVALUACIÓN FINAL
    const notas = [7, 6, 5, 7, 4, 6, 7, 5, 7, 6];
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO evaluacionFinal (nota, comentarios, id_agenda_fk) VALUES ($1, $2, $3);',
        [notas[i-1], `Comentario de prueba del servicio número ${i}`, i]
      );
    }

    // 17. CHECKLIST_TAREA
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO checklist_tarea (id_checklist_fk, id_tarea_fk) VALUES ($1, $2);',
        [i, i]
      );
    }

    await client.query('COMMIT');
    console.log('✅ ¡Poblado completo! Las 17 tablas tienen exactamente 10 filas relacionadas.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al insertar datos en Supabase:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

poblarBaseDeDatos();