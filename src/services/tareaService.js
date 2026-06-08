const db = require ('../config/db');
const Tareas = require('../entities/tarea.entity');

const tareaRepository = db.getRepository(Tareas);

/**
 *  crear una nueva tarea
 * @param {Object} datosTarea 
 * @return {Object} 
 */

const crearTarea = async (datosTarea) => {
    const nuevaTarea = tareaRepository.create(datosTarea);
    return await tareaRepository.save(nuevaTarea);
};

/**
 * obtener todas las tareas
 * @return {Array} 
 */

const obtenerTodasLasTarea = async ()=> {
    return await tareaRepository.find();
    return [];
};

/**
 * obtener tarea por id
 * @param {Number} id_tarea 
 * @returns {Object | null}
 */

const obtenerTareaPorId = async (id_tarea) =>{
    return await tareaRepository.findOneBy({id_tarea});
    return null;
};

/**
 * actualizar una tarea existente
 * @param {Number} id_tarea 
 * @param {Object} datosActualizados 
 * @returns {Object | null}
 */

const actualizarTarea = async (id_tarea, datosActualizados) => {
    await tareaRepository.update(id_tarea, datosActualizados);
    return await obtenerTareaPorId(id_tarea);
};

/**
 * eliminar una tarea 
 * @param {Number} id_tarea
 * @return {Boolean}
 */

const eliminarTarea = async (id_tarea) => {
    const result = await tareaRepository.delete(id_tarea);
    if(result.affected === 0) {
        return false;
    }
    return true;
};

module.exports = {
    crearTarea,
    obtenerTodasLasTarea,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea
};