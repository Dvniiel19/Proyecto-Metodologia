

const db = require('../config/db');
const EvaluacionFinal = require('../entities/evaluacion_final.entity');

const evaluacionRepository = db.getRepository(EvaluacionFinal);

/**
 * crear una nueva evaluacion
 * @param {Object} datosEvaluacion
 * @return {Object} 
*/

const crearEvaluacion = async (datosEvaluacion) => {
    const nuevaEvaluacion = evaluacionRepository.create(datosEvaluacion);
    return await evaluacionRepository.save(nuevaEvaluacion);
};

/**
 * obtener todas las evaluaciones
 * @return {Array} 
 */

const obtenerTodasLasEvaluaciones = async () => {
    return await evaluacionRepository.find();
};

/**
 * obtener evaluacion por id
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerEvaluacionPorId = async (id_evaluacion) => {
    return await evaluacionRepository.findOneBy({id_evaluacion});
};

/**
 * actualizar una evaluacion existente
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null}  
 */

const actualizarEvaluacion = async (id_evaluacion, datosActualizados) => {
    await evaluacionRepository.update(id_evaluacion,datosActualizados);
    return await obtenerEvaluacionPorId(id_evaluacion);
}

/**
 * eliminar una evaluacion
 * @param {Number} id_evaluacion 
 * @return {Boolean} 
 */

const eliminarEvaluacion = async (id_evaluacin) => {
    const result = await evaluacionRepository.delete(id_evaluacion);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearEvaluacion,
    obtenerTodasLasEvaluaciones,
    obtenerEvaluacionPorId,
    actualizarEvaluacion,
    eliminarEvaluacion,
};
