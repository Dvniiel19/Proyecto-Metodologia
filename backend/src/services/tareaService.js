const db = require('../config/db');
const Tareas = require('../entities/tarea.entity');
const { notificarClienteTareaPendienteValidacion } = require('./emailService');

const tareaRepository = db.getRepository(Tareas);

const mapearRelacionAsignacion = (datosTarea = {}) => {
    const payload = { ...datosTarea };
    if (payload.id_asignacion) {
        payload.asignacion_servicio = { id_asignacion: Number(payload.id_asignacion) };
    }
    delete payload.id_asignacion;
    return payload;
};

const crearTarea = async (datosTarea) => {
    const nuevaTarea = tareaRepository.create(mapearRelacionAsignacion(datosTarea));
    return await tareaRepository.save(nuevaTarea);
};

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
    await tareaRepository.update(Number(id_tarea), mapearRelacionAsignacion(datosActualizados));
    return await obtenerTareaPorId(id_tarea);
};

const eliminarTarea = async (id_tarea) => {
    const result = await tareaRepository.delete(Number(id_tarea));
    return result.affected > 0;
};

const finalizarTareaConEvidencia = async (id_tarea, archivoEvidencia) => {
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

        // Solo se puede finalizar una tarea que sigue en proceso; evita que una
        // segunda subida pise la evidencia de una tarea ya enviada a validacion
        if (tarea.estado !== 'En Proceso') {
            const error = new Error(`La tarea no se puede finalizar porque su estado actual es "${tarea.estado}".`);
            error.statusCode = 409;
            throw error;
        }

        // El cliente no siempre tiene una cuenta de usuario vinculada (id_usuario es
        // nullable), asi que el correo de notificacion es best-effort: si no hay
        // correo o si falla el envio, la tarea igual se finaliza y guarda su evidencia.
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
                    // La descripcion vive en la asignacion; las tareas antiguas
                    // conservan la propia como respaldo
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
    const trabajadorRepo = db.getRepository('Trabajador');
    const trabajador = await trabajadorRepo.findOneBy({ id_usuario });
    if (!trabajador) return [];

    // Se parte desde las asignaciones (no desde las tareas) para que el trabajador
    // vea todos sus servicios asignados, incluso los que aun no tienen tareas creadas
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
                // La descripcion vive en la asignacion; las tareas antiguas
                // conservan la propia como respaldo
                descripcion: asig.descripcion ?? t.descripcion,
                estado: t.estado,
                foto_evidencia: t.foto_evidencia,
            });
        }
    }

    return Object.values(mapa).sort(
        (a, b) => new Date(b.fecha_programada) - new Date(a.fecha_programada),
    );
};

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

    // Filtramos solo las tareas del cliente autenticado
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

        // Verificar que sea el dueño
        const idUsuarioTitular = tarea.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.id_usuario;
        if (Number(idUsuarioTitular) !== Number(id_usuario)) {
            const error = new Error('No tienes permiso para validar esta tarea');
            error.statusCode = 403;
            throw error;
        }

        // Solo se puede validar una tarea en "Pendiente de Validación"
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

        // Si se aprobó la tarea, actualizamos el estado de la agenda si todas las tareas están completadas
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