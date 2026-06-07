

const db = require('../config/db');
const EvaluacionFinal = require('../entities/evaluacionFinal.entity');

const evaluacionRepository = db.getRepository(EvaluacionFinal);

/**
 * crear una nueva evaluacion
 * @param {Object} datosEvaluacion
 * @return {Object} 
*/

const crearEvaluacionFinal = async (datosEvaluacion) => {
    const nuevaEvaluacion = evaluacionRepository.create(datosEvaluacion);
    return await evaluacionRepository.save(nuevaEvaluacion);
};

/**
 * obtener todas las evaluaciones
 * @return {Array} 
 */

const obtenerTodasLasEvaluacionFinal = async () => {
    return await evaluacionRepository.find();
};

/**
 * obtener evaluacion por id
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerEvaluacionFinalPorId = async (id_evaluacion) => {
    return await evaluacionRepository.findOneBy({id_evaluacion});
};

/**
 * actualizar una evaluacion existente
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null}  
 */

const actualizarEvaluacionFinal = async (id_evaluacion, datosActualizados) => {
    await evaluacionRepository.update(id_evaluacion,datosActualizados);
    return await obtenerEvaluacionFinalPorId(id_evaluacion);
}

/**
 * eliminar una evaluacion
 * @param {Number} id_evaluacion 
 * @return {Boolean} 
 */

const eliminarEvaluacionFinal = async (id_evaluacion) => {
    const result = await evaluacionRepository.delete(id_evaluacion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearEvaluacionFinal,
    obtenerTodasLasEvaluacionFinal,
    obtenerEvaluacionFinalPorId,
    actualizarEvaluacionFinal,
    eliminarEvaluacionFinal,
};
