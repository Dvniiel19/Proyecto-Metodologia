const db = require('../config/db');
const Tareas = require('../entities/tarea.entity');
const { notificarClienteTareaPendienteValidacion } = require('./emailService');

const tareaRepository = db.getRepository(Tareas);

// Mapea la relacion de asignacion a la estructura esperada por TypeORM
const mapearRelacionAsignacion = (datosTarea = {}) => {
    const payload = { ...datosTarea };
    if (payload.id_asignacion) {
        payload.asignacion_servicio = { id_asignacion: Number(payload.id_asignacion) };
    }
    delete payload.id_asignacion;
    return payload;
};

// Crea una tarea nueva vinculada a una asignacion de servicio
const crearTarea = async (datosTarea) => {
    const nuevaTarea = tareaRepository.create(mapearRelacionAsignacion(datosTarea));
    return await tareaRepository.save(nuevaTarea);
};

// Lista todas las tareas con su asignacion (vista del supervisor/admin)
const obtenerTodasLasTarea = async () => {
    return await tareaRepository.find({
        relations: { asignacion_servicio: true },
    });
};

const obtenerTareaPorId = async (id_tarea) => {
    return await tareaRepository.findOne({
        where: { id_tarea: Number(id_tarea) },
        relations: { asignacion_servicio: true },
    });
};

const actualizarTarea = async (id_tarea, datosActualizados) => {
    // update() no devuelve la entidad, por eso se vuelve a consultar para responder al front
    await tareaRepository.update(Number(id_tarea), mapearRelacionAsignacion(datosActualizados));
    return await obtenerTareaPorId(id_tarea);
};

const eliminarTarea = async (id_tarea) => {
    const result = await tareaRepository.delete(Number(id_tarea));
    return result.affected > 0;
};

// REQUISITO EVIDENCIA: el trabajador finaliza la tarea adjuntando UNA foto.
// Dentro de una transaccion: valida el estado, guarda la ruta de la evidencia,
// cambia el estado a "Pendiente de Validación" y notifica por correo al cliente.
const finalizarTareaConEvidencia = async (id_tarea, archivoEvidencia) => {
    return await db.transaction(async (manager) => {
        const repositorioTx = manager.getRepository(Tareas);

        // Se cargan las relaciones en cadena (tarea -> asignacion -> agenda ->
        // contrato -> cliente -> usuario) para llegar al correo del cliente titular

        const tarea = await repositorioTx.findOne({
            where: { id_tarea: Number(id_tarea) },
            relations: {
                asignacion_servicio: {
                    agenda: {
                        contrato: {
                            cliente: { usuario: true },
                        },
                    },
                },
            },
        });

        if (!tarea) {
            return null;
        }

        if (tarea.estado !== 'En Proceso') {
            const error = new Error(`La tarea no se puede finalizar porque su estado actual es "${tarea.estado}".`);
            error.statusCode = 409;
            throw error;
        }

        // Se obtiene el correo del cliente titular del contrato asociado a la tarea
        const correoCliente = tarea?.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.correo;

        tarea.estado = 'Pendiente de Validación';
        tarea.foto_evidencia = `uploads/evidencias/${archivoEvidencia.filename}`.replace(/\\/g, '/');

        await repositorioTx.save(tarea);

        let emailEnviado = false;
        if (correoCliente) {
            try {
                await notificarClienteTareaPendienteValidacion({
                    correoCliente,
                    idTarea: tarea.id_tarea,
                    // La descripcion de la tarea puede estar en la asignacion (si se definio ahi) o en la propia tarea (si es antigua)
                    descripcionTarea: tarea.asignacion_servicio?.descripcion ?? tarea.descripcion,
                    rutaEvidencia: archivoEvidencia.path,
                });
                emailEnviado = true;
            } catch (emailError) {
                console.error('Fallo el envío de correo de notificación al cliente:', emailError.message);
            }
        }

        return {
            id_tarea: tarea.id_tarea,
            estado: tarea.estado,
            foto_evidencia: tarea.foto_evidencia,
            correo_notificado: correoCliente || null,
            email_enviado: emailEnviado,
        };
    });
};

const obtenerMisTareas = async (id_usuario) => {
    // Vista del trabajador: todas las tareas de limpieza asignadas a SUS servicios, con la foto de evidencia si ya fue finalizada. 
    const trabajadorRepo = db.getRepository('Trabajador');
    const trabajador = await trabajadorRepo.findOneBy({ id_usuario });
    if (!trabajador) return [];

    // Se obtiene la lista de asignaciones del trabajador, con sus agendas y tareas, para luego mapearlas a la estructura que espera el front.
    const asignaciones = await db
        .getRepository('AsignarServicio')
        .createQueryBuilder('asignacion')
        .innerJoinAndSelect('asignacion.agenda', 'agenda')
        .leftJoinAndSelect('asignacion.tareas', 'tarea')
        .leftJoinAndSelect('agenda.contrato', 'contrato')
        .leftJoinAndSelect('contrato.cliente', 'cliente')
        .leftJoinAndSelect('asignacion.usuario', 'usuario')
        .where('asignacion.id_trabajador = :id_trabajador', {
            id_trabajador: trabajador.id_trabajador,
        })
        .orderBy('agenda.fecha_programada', 'DESC')
        .addOrderBy('tarea.id_tarea', 'ASC')
        .getMany();

    // Se agrupan las asignaciones por servicio (id_servicio) para que el front muestre una tarjeta por jornada con todas sus tareas adentro
    const mapa = {};
    for (const asig of asignaciones) {
        const agenda = asig.agenda;
        const idServicio = agenda?.id_servicio;
        if (!idServicio) continue;

        if (!mapa[idServicio]) {
            mapa[idServicio] = {
                id_servicio: idServicio,
                fecha_programada: agenda.fecha_programada,
                hora_inicio: agenda.hora_inicio,
                hora_fin: agenda.hora_fin,
                estado_servicio: agenda.estado,
                contrato: agenda.contrato
                    ? { id_contrato: agenda.contrato.id_contrato, precio: agenda.contrato.precio }
                    : null,
                cliente: agenda.contrato?.cliente
                    ? {
                          id_cliente: agenda.contrato.cliente.id_cliente,
                          nombre: agenda.contrato.cliente.nombre,
                          apellido: agenda.contrato.cliente.apellido,
                          direccion: agenda.contrato.cliente.direccion,
                          telefono: agenda.contrato.cliente.telefono,
                      }
                    : null,
                asignado_por: asig.usuario?.correo || '—',
                tareas: [],
            };
        }
        for (const t of asig.tareas || []) {
            mapa[idServicio].tareas.push({
                id_tarea: t.id_tarea,
                // La descripcion de la tarea puede estar en la asignacion (si se definio ahi) o en la propia tarea (si es antigua)
                descripcion: asig.descripcion ?? t.descripcion,
                estado: t.estado,
                foto_evidencia: t.foto_evidencia,
            });
        }
    }

    // Servicios mas recientes primero
    return Object.values(mapa).sort(
        (a, b) => new Date(b.fecha_programada) - new Date(a.fecha_programada),
    );
};

// Vista del cliente: tareas en "Pendiente de Validación" que pertenecen a SUS
// contratos, con la foto de evidencia para que decida aprobar o rechazar
const obtenerTareasPendientesCliente = async (id_usuario) => {
    const repo = db.getRepository(Tareas);

    const tareas = await repo.find({
        where: { estado: 'Pendiente de Validación' },
        relations: {
            asignacion_servicio: {
                agenda: {
                    contrato: {
                        cliente: { usuario: true },
                    },
                },
                trabajador: true,
            },
        },
    });

    // Filtro de titularidad: solo las tareas cuyo contrato pertenece al usuario
    // autenticado (el id viene del token, nunca del body)
    return tareas.filter(
        (t) => t.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.id_usuario === Number(id_usuario),
    ).map((t) => ({
        id_tarea: t.id_tarea,
        descripcion: t.asignacion_servicio?.descripcion ?? t.descripcion,
        estado: t.estado,
        foto_evidencia: t.foto_evidencia,
        id_servicio: t.asignacion_servicio?.agenda?.id_servicio,
        fecha_servicio: t.asignacion_servicio?.agenda?.fecha_programada,
        trabajador: t.asignacion_servicio?.trabajador
            ? `${t.asignacion_servicio.trabajador.nombre} ${t.asignacion_servicio.trabajador.apellido}`
            : null,
        cliente: t.asignacion_servicio?.agenda?.contrato?.cliente
            ? {
                  nombre: t.asignacion_servicio.agenda.contrato.cliente.nombre,
                  apellido: t.asignacion_servicio.agenda.contrato.cliente.apellido,
              }
            : null,
    }));
};

// El cliente aprueba o rechaza una tarea finalizada. Transaccional porque ademas
// de cambiar la tarea puede cerrar la agenda completa (todas las tareas listas).
const validarTareaCliente = async (id_tarea, id_usuario, accion) => {
    return await db.transaction(async (manager) => {
        const repositorioTx = manager.getRepository(Tareas);

        const tarea = await repositorioTx.findOne({
            where: { id_tarea: Number(id_tarea) },
            relations: {
                asignacion_servicio: {
                    agenda: {
                        contrato: {
                            cliente: { usuario: true },
                        },
                    },
                },
            },
        });

        if (!tarea) {
            return null;
        }

        // Se valida que el usuario autenticado sea el titular del contrato asociado a la tarea
        const idUsuarioTitular = tarea.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.id_usuario;
        if (Number(idUsuarioTitular) !== Number(id_usuario)) {
            const error = new Error('No tienes permiso para validar esta tarea');
            error.statusCode = 403;
            throw error;
        }

        // Solo se puede validar una tarea en "Pendiente de Validacion"
        if (tarea.estado !== 'Pendiente de Validación') {
            const error = new Error(`La tarea no se puede validar porque su estado actual es "${tarea.estado}".`);
            error.statusCode = 409;
            throw error;
        }

        const nuevosEstados = {
            aprobado: 'Aprobado',
            rechazado: 'Rechazado',
        };

        if (!nuevosEstados[accion]) {
            const error = new Error(`Acción inválida: "${accion}". Use "aprobado" o "rechazado".`);
            error.statusCode = 400;
            throw error;
        }

        tarea.estado = nuevosEstados[accion];
        await repositorioTx.save(tarea);

        // Post-condicion: si con esta aprobacion todas las tareas de la agenda quedan aprobadas o rechazadas, se cierra 
        // la agenda cambiando su estado a "Pendiente de Evaluacion"
        if (accion === 'aprobado') {
            const agendaRepo = manager.getRepository('Agenda');
            const agenda = await agendaRepo.findOne({
                where: { id_servicio: tarea.asignacion_servicio.agenda.id_servicio },
                relations: { asignar_servicio: { tareas: true } },
            });

            if (agenda) {
                const todasLasTareas = agenda.asignar_servicio
                    ?.flatMap((asig) => asig.tareas ?? [])
                    .filter((t) => t.id_tarea !== tarea.id_tarea) ?? [];

                const todasCompletadas = todasLasTareas.every(
                    (t) => t.estado === 'Aprobado' || t.estado === 'Rechazado',
                );

                if (todasCompletadas) {
                    await agendaRepo.update(agenda.id_servicio, { estado: 'Pendiente de Evaluacion' });
                }
            }
        }

        return {
            id_tarea: tarea.id_tarea,
            estado: tarea.estado,
        };
    });
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea,
    finalizarTareaConEvidencia,
    obtenerMisTareas,
    obtenerTareasPendientesCliente,
    validarTareaCliente,
};