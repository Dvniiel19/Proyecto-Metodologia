// Servicio de Tareas: contiene toda la logica de negocio de las tareas de limpieza
// (CRUD, finalizacion con evidencia fotografica, validacion del cliente y
// vistas filtradas por usuario). El controlador solo delega aqui.
const db = require('../config/db');
const Tareas = require('../entities/tarea.entity');
const { notificarClienteTareaPendienteValidacion } = require('./emailService');

const tareaRepository = db.getRepository(Tareas);

// El frontend envia id_asignacion plano, pero TypeORM espera la relacion como
// objeto anidado ({ asignacion_servicio: { id_asignacion } }). Este helper hace
// esa traduccion antes de crear o actualizar una tarea.
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
    // affected > 0 indica si realmente existia la fila; el controlador responde 404 si es false
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

// Vista "Mis Tareas" del trabajador: agrupa sus asignaciones por servicio,
// con los datos del cliente, el contrato y las tareas de cada jornada
const obtenerMisTareas = async (id_usuario) => {
    // El token trae id_usuario, pero las asignaciones apuntan a id_trabajador:
    // primero se resuelve el perfil de trabajador vinculado a ese usuario
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

    // Se agrupan las asignaciones por servicio (id_servicio) para que el front
    // muestre una tarjeta por jornada con todas sus tareas adentro
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

        // Verificar que sea el dueño: el titular del contrato es el unico que
        // puede validar; evita que un cliente valide tareas ajenas cambiando el id
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

        // Post-condicion: si con esta aprobacion TODAS las tareas del servicio
        // quedan resueltas (aprobadas o rechazadas), la agenda pasa a
        // "Pendiente de Evaluacion" para habilitar la nota del cliente
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