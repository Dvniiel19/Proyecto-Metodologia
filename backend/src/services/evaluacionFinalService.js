

const db = require('../config/db');

let evaluacionRepository;

const getRepository = () => {
    if (!evaluacionRepository) {
        const EvaluacionFinal = require('../entities/evaluacionFinal.entity');
        evaluacionRepository = db.getRepository(EvaluacionFinal);
    }
    return evaluacionRepository;
};

/**
 * crear una nueva evaluacion
 * @param {Object} datosEvaluacion
 * @return {Object} 
*/
const crearEvaluacionFinal = async (datosEvaluacion) => {
    const repo = getRepository();
    const nuevaEvaluacion = repo.create(datosEvaluacion);
    return await repo.save(nuevaEvaluacion);
};

/**
 * obtener todas las evaluaciones
 * @return {Array} 
 */

const obtenerTodasLasEvaluacionFinal = async () => {
    const repo = getRepository();
    return await repo.find();
};

/**
 * obtener evaluacion por id
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerEvaluacionFinalPorId = async (id_evaluacion) => {
    const repo = getRepository();
    return await repo.findOneBy({id_evaluacion});
};

/**
 * actualizar una evaluacion existente
 * @param {Number} id_evaluacion 
 * @param {Object} datosActualizados 
 * @returns {Object | null}  
 */

const actualizarEvaluacionFinal = async (id_evaluacion, datosActualizados) => {
    const repo = getRepository();
    await repo.update(id_evaluacion, datosActualizados);
    return await obtenerEvaluacionFinalPorId(id_evaluacion);
}

/**
 * eliminar una evaluacion
 * @param {Number} id_evaluacion 
 * @return {Boolean} 
 */

const eliminarEvaluacionFinal = async (id_evaluacion) => {
    const repo = getRepository();
    const result = await repo.delete(id_evaluacion);
    if (result.affected === 0) {
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
