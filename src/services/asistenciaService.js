

const db = require('../config/db');
const Asistencia = require('../entities/asistencia.entity');

const asistenciaRepository = db.getRepository(Asistencia);

/**
 * crear una asistencia 
 * @param {Object} datosAsistencia  
 * @return {Object} 
*/

const crearAsistencia  = async (datosAsistencia ) => {
    const nuevaAsistencia = asistenciaRepository.create(datosAsistencia);
    return await asistenciaRepository.save(nuevaAsistencia);
};

/**
 * obtener todas las asistencias
 * @return {Array}
 */

const obtenerTodasLasAsistencias = async () => {
    return await asistenciaRepository.find();
};

/**
 * obtener asistencia por id
 * @param {Number} id_asistencia 
 * @param {Object} datosActualizados
 * @returns {Object | null}
 */

const obtenerAsistenciaPorId = async (id_asistencia) => {
    return await asistencialRepository.findOneBy({id_asistencia});
};

/**
 * actualizar una asistencia existente
 * @param {Number} id_asistencia 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarAsistencia = async (id_asistencia, datosActualizados) => {
    await asistenciaRepository.update(id_asistencia,datosActualizados);
    return await obtenerAsistenciaPorId(id_asistencia);
}

/**
 * eliminar una asistencia
 * @param {Number} id_asistencia - 
 * @return {Boolean}
 */

const eliminarAsistencia = async (id_asistencia) => {
    const result = await asistenciaRepository.delete(id_asistencia);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearAsistencia,
    obtenerTodasLasAsistencias,
    obtenerAsistenciaPorId,
    actualizarAsistencia,
    eliminarAsistencia,
};
