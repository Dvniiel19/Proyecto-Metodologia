

const db = require('../config/db');
const Checklist = require('../entities/checklist.entity');

const checklistRepository = db.getRepository(Checklist);

/**
 * crear una nueva checklist
 * @param {Object} datosChecklist 
 * @return {Object} 
*/

const crearCheckList = async (datosChecklist) => {
    const nuevoChecklist = checklistRepository.create(datosChecklist);
    return await checklistRepository.save(nuevoChecklist);
};

/**
 * obtener todas las checklist
 * @return {Array} 
 */

const obtenerTodosLosCheckList = async () => {
    return await checklistRepository.find();
};

/**
 * obtener checklist por id
 * @param {Number} id_checklist
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerCheckListPorId = async (id_checklist) => {
    return await checklistRepository.findOneBy({id_checklist});
};

/**
 * actualizar una checklist existente
 * @param {Number} id_checklist 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarCheckList = async (id_checklist, datosActualizados) => {
    await checklistRepository.update(id_checklist,datosActualizados);
    return await obtenerCheckListPorId(id_checklist);
}

/**
 * eliminar una checklist
 * @param {Number} id_checklist
 * @return {Boolean} 
 */

const eliminarCheckList = async (id_checklist) => {
    const result = await checklistRepository.delete(id_checklist);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearCheckList,
    obtenerTodosLosCheckList,
    obtenerCheckListPorId,
    actualizarCheckList,
    eliminarCheckList,
};
