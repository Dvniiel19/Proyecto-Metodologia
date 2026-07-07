const db = require ('../config/db');
const Tareas = require('../entities/tarea.entity');
const { notificarClienteTareaPendienteValidacion } = require('./emailService');

const tareaRepository = db.getRepository(Tareas);


// El body de la API trae id_asignacion como numero simple, pero TypeORM necesita
// la relacion como objeto ({ asignacion_servicio: { id_asignacion } }) para enlazar
// la tarea con su asignacion. Esta funcion hace esa traduccion antes de guardar.
const mapearRelacionAsignacion = (datosTarea = {}) => {
    const payload = { ...datosTarea };
    if (payload.id_asignacion) {
        payload.asignacion_servicio = { id_asignacion: Number(payload.id_asignacion) };
    }
    delete payload.id_asignacion;
    return payload;
};

/**
 *  crear una nueva tarea
 * @param {Object} datosTarea 
 * @return {Object} 
 */

const crearTarea = async (datosTarea) => {
   const nuevaTarea = tareaRepository.create(mapearRelacionAsignacion(datosTarea));
    return await tareaRepository.save(nuevaTarea);
};

/**
 * obtener todas las tareas
 * @return {Array} 
 */

const obtenerTodasLasTarea = async ()=> {
    return await tareaRepository.find({
        relations: {
            asignacion_servicio: true,
        },
    });
};

/**
 * obtener tarea por id
 * @param {Number} id_tarea 
 * @returns {Object | null}
 */

const obtenerTareaPorId = async (id_tarea) =>{
    return await tareaRepository.findOne({
        where: { id_tarea: Number(id_tarea) },
        relations: {
            asignacion_servicio: true,
        },
    });
};

/**
 * actualizar una tarea existente
 * @param {Number} id_tarea 
 * @param {Object} datosActualizados 
 * @returns {Object | null}
 */

const actualizarTarea = async (id_tarea, datosActualizados) => {
    await tareaRepository.update(Number(id_tarea), mapearRelacionAsignacion(datosActualizados));
    return await obtenerTareaPorId(id_tarea);
};

/**
 * eliminar una tarea 
 * @param {Number} id_tarea
 * @return {Boolean}
 */

const eliminarTarea = async (id_tarea) => {
     const result = await tareaRepository.delete(Number(id_tarea));
    if(result.affected === 0) {
        return false;
    }
    return true;
};

// Finalizar una tarea: el trabajador sube su foto de evidencia, la tarea pasa a
// "Pendiente de Validacion" y se le avisa por correo al cliente.
// Todo corre dentro de una TRANSACCION: si el correo falla, el cambio de estado
// se revierte y la tarea no queda finalizada a medias.
const finalizarTareaConEvidencia = async (id_tarea, archivoEvidencia) => {
    return await db.transaction(async (manager) => {
        // Dentro de una transaccion hay que usar el repositorio del manager transaccional,
        // no el repositorio global, para que las operaciones queden dentro de la misma transaccion
        const repositorioTransaccional = manager.getRepository(Tareas);
        // Se carga la tarea con toda la cadena de relaciones necesaria para llegar
        // al correo del cliente: tarea → asignacion → agenda → contrato → cliente → usuario
        const tarea = await repositorioTransaccional.findOne({
            where: { id_tarea: Number(id_tarea) },
            relations: {
                asignacion_servicio: {
                    agenda: {
                        contrato: {
                            cliente: {
                                usuario: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tarea) {
            return null; // el controller lo traduce a 404
        }

        // Se obtiene el correo del cliente desde la cadena de relaciones. Si no se encuentra, se lanza un error para que la transaccion haga rollback.
        const correoCliente = tarea?.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.correo;
        if (!correoCliente) {
            throw new Error('No se pudo obtener el correo del cliente asociado a la tarea.');
        }

        tarea.estado = 'Pendiente de Validación';
        // Se guarda la ruta relativa de la foto (servida por express.static en /uploads);
        // el replace normaliza las barras invertidas si el servidor corre en Windows
        tarea.foto_evidencia = `uploads/evidencias/${archivoEvidencia.filename}`.replace(/\\/g, '/');

        await repositorioTransaccional.save(tarea);

        // Si el correo falla se relanza el error: al salir la excepcion de db.transaction,
        // TypeORM hace ROLLBACK y la tarea NO queda finalizada a medias (garantia todo-o-nada).
        // El statusCode 502 le indica al controller que fallo un servicio externo (SMTP).
        try {
            await notificarClienteTareaPendienteValidacion({
                correoCliente,
                idTarea: tarea.id_tarea,
                descripcionTarea: tarea.descripcion,
            });
        } catch (emailError) {
            console.error('Fallo el envio de correo, se revierte la finalizacion:', emailError.message);
            const error = new Error('No se pudo notificar al cliente por correo; la tarea no fue finalizada. Intente nuevamente.');
            error.statusCode = 502;
            throw error;
        }

        // Se retorna un resumen con solo lo que el frontend necesita mostrar
        return {
            id_tarea: tarea.id_tarea,
            estado: tarea.estado,
            foto_evidencia: tarea.foto_evidencia,
            correo_notificado: correoCliente,
            // si llegamos aqui el correo se envio si o si (de lo contrario hubo rollback)
            email_enviado: true,
        };
    });
};

// Obtiene las tareas del trabajador logueado, agrupadas por servicio/jornada.
// 1. Busca el perfil de trabajador vinculado al usuario
// 2. Busca todas las asignaciones de ese trabajador con relaciones completas
// 3. Agrupa las tareas por servicio para facilitar la visualizacion en el frontend
const obtenerMisTareas = async (id_usuario) => {
    const trabajadorRepo = db.getRepository('Trabajador');
    const trabajador = await trabajadorRepo.findOneBy({ id_usuario });
    if (!trabajador) return [];

    const tareas = await tareaRepository
        .createQueryBuilder('tarea')
        .innerJoinAndSelect('tarea.asignacion_servicio', 'asignacion')
        .innerJoinAndSelect('asignacion.agenda', 'agenda')
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
    for (const t of tareas) {
        const asig = t.asignacion_servicio;
        const agenda = asig?.agenda;
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
        mapa[idServicio].tareas.push({
            id_tarea: t.id_tarea,
            descripcion: t.descripcion,
            estado: t.estado,
            foto_evidencia: t.foto_evidencia,
        });
    }

    return Object.values(mapa).sort(
        (a, b) => new Date(b.fecha_programada) - new Date(a.fecha_programada),
    );
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea,
    finalizarTareaConEvidencia,
    obtenerMisTareas,
};