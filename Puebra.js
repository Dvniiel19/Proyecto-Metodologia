const { Pool } = require('pg'); // Si usas PostgreSQL. Cambiar por 'mysql2' si corresponde.

// Configuración de la conexión a tu base de datos
const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_password',
  port: 5432,
});

async function poblarBaseDeDatos() {
  const client = await pool.connect();

  try {
    // Iniciamos una transacción para asegurarnos de que se suba todo o nada
    await client.query('BEGIN');
    console.log('🔄 Iniciando la inserción de datos...');

  
    // 2. INSUMOS
    const insumos = [
      ['Líquido Limpiador Industrial 5L', 20],
      ['Paños de Microfibra (Pack 10)', 15],
      ['Desengrasante Multiuso', 30],
      ['Alcohol Isopropílico 1L', 10],
      ['Guantes de Nitrilo (Caja 100)', 25]
    ];
    for (const [nombre, stock] of insumos) {
      await client.query('INSERT INTO insumos (nombre, stock) VALUES ($1, $2);', [nombre, stock]);
    }

    // 3. TAREAS
    const tareas = [
      'Limpieza de pisos y superficies',
      'Desinfección de baños públicos',
      'Aspirado de alfombras y tapices',
      'Limpieza de ventanales exteriores',
      'Revisión de puntos de red y cableado'
    ];
    for (const tarea of tareas) {
      await client.query('INSERT INTO tarea (nombre) VALUES ($1);', [tarea]);
    }

    // 4. VALIDACIÓN SUPERVISOR
    const validaciones = [
      ['Aprobado', 'Todo impecable, cumple con los estándares.'],
      ['Rechazado con observaciones', 'Faltó repasar las esquinas del fondo en el ala norte.'],
      ['Aprobado', 'Validado sin contratiempos por el supervisor de turno.']
    ];
    for (const [estado, obs] of validaciones) {
      await client.query('INSERT INTO validacion_supervisor (estado_aprobacion, observaciones) VALUES ($1, $2);', [estado, obs]);
    }

  

    // 6. TRABAJADORES Y CLIENTES
    await client.query(
      'INSERT INTO trabajador (nombre, apellido, telefono, id_usuario_fk) VALUES ($1, $2, $3, $4);',
      ['Pedro', 'González', '+56911112222', 3] // id_usuario_fk = 3
    );

    await client.query(
      'INSERT INTO cliente (nombre, apellido, telefono, historial_servicio, id_usuario_fk) VALUES ($1, $2, $3, $4, $5);',
      ['Claudio', 'Aguilera', '+56933334444', 'Cliente corporativo desde 2024.', 4] // id_usuario_fk = 4
    );

    // 7. ESTABLECIMIENTOS Y CONTRATOS
    await client.query(
      'INSERT INTO establecimiento (direccion, tipo_establecimiento, id_cliente_fk) VALUES ($1, $2, $3), ($4, $5, $6);',
      ['Av. O\'Higgins 456, Chillán', 'Oficina Comercial', 1, 'Ruta 148, Km 25, Quillón', 'Centro de Distribución', 1]
    );

    await client.query(
      'INSERT INTO contrato (fecha_inicio, fecha_fin, precio, id_cliente_fk) VALUES ($1, $2, $3, $4);',
      ['2026-01-01', '2026-12-31', 1250000.00, 1]
    );

    // 8. TRANSACCIONES
    await client.query(
      'INSERT INTO transacciones (tipo_transaccion, monto, fecha_emision, fecha_pago, estado_pago, id_contrato_fk) VALUES ($1, $2, $3, $4, $5, $6);',
      ['Transferencia', 1250000.00, new Date('2026-05-01T09:00:00'), new Date('2026-05-03T14:20:00'), 'Pagado', 1]
    );

    // 9. OPERACIONES (AGENDA, CHECKLIST, CONSUMO)
    await client.query(
      'INSERT INTO agenda (fecha_programada, estado_trabajo, id_establecimiento_fk, id_contrato_fk) VALUES ($1, $2, $3, $4);',
      [new Date('2026-06-04T08:30:00'), 'En Proceso', 1, 1]
    );

    await client.query(
      'INSERT INTO checklist (estado, foto_servicio, id_agenda_fk, id_validacion_fk) VALUES ($1, $2, $3, $4);',
      ['Completado', 'storage/bucket/fotos/srv_001_final.jpg', 1, 1]
    );

    await client.query(
      'INSERT INTO consumolnsumo (cantidad_utilizada, id_agenda_fk, id_insumo_fk) VALUES ($1, $2, $3), ($4, $5, $6);',
      [2, 1, 1, 5, 1, 2] // 2 del insumo 1, y 5 del insumo 2
    );

    // 10. ASIGNACIONES, ASISTENCIA Y EVALUACIÓN
    await client.query(
      'INSERT INTO asignar_servicio (fecha_asignada, id_trabajador_fk, id_agenda_fk) VALUES ($1, $2, $3);',
      [new Date('2026-06-04'), 1, 1]
    );

    await client.query(
      'INSERT INTO asistencia (hora_entrada, hora_salida, id_trabajador_fk, id_agenda_fk) VALUES ($1, $2, $3, $4);',
      [new Date('2026-06-04T08:15:22'), new Date('2026-06-04T13:00:10'), 1, 1]
    );

    await client.query(
      'INSERT INTO evaluacionFinal (nota, comentarios, id_agenda_fk) VALUES ($1, $2, $3);',
      [7, 'Excelente disposición del personal y rapidez.', 1]
    );

    // Relación N:M (Checklist - Tarea)
    await client.query(
      'INSERT INTO checklist_tarea (id_checklist_fk, id_tarea_fk) VALUES ($1, $2), ($3, $4);',
      [1, 1, 1, 2]
    );

    // Confirmamos los cambios si todo salió bien
    await client.query('COMMIT');
    console.log('✅ Base de datos poblada con éxito.');

  } catch (error) {
    // Si algo falla, deshace todo para evitar datos duplicados o corruptos
    await client.query('ROLLBACK');
    console.error('❌ Error insertando datos, se hizo ROLLBACK:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

poblarBaseDeDatos();
