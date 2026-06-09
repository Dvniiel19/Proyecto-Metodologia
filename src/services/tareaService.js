const db = require ('../config/db');
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
    return [];
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
    return null;
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

const finalizarTareaConEvidencia = async (id_tarea, archivoEvidencia) => {
    return await db.transaction(async (manager) => {
        const repositorioTransaccional = manager.getRepository(Tareas);
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
            return null;
        }

        const correoCliente = tarea?.asignacion_servicio?.agenda?.contrato?.cliente?.usuario?.correo;
        if (!correoCliente) {
            throw new Error('No se pudo obtener el correo del cliente asociado a la tarea.');
        }

        tarea.estado = 'Pendiente de Validación';
        tarea.foto_evidencia = `uploads/evidencias/${archivoEvidencia.filename}`.replace(/\\/g, '/');

        await repositorioTransaccional.save(tarea);
        await notificarClienteTareaPendienteValidacion({
            correoCliente,
            idTarea: tarea.id_tarea,
            descripcionTarea: tarea.descripcion,
        });

        return {
            id_tarea: tarea.id_tarea,
            estado: tarea.estado,
            foto_evidencia: tarea.foto_evidencia,
            correo_notificado: correoCliente,
        };
    });
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea,
    finalizarTareaConEvidencia
};