

const db = require('../config/db');

let evaluacionRepository;

const getRepository = () => {
    if (!evaluacionRepository) {
        const EvaluacionFinal = require('../entities/evaluacionFinal.entity');
        evaluacionRepository = db.getRepository(EvaluacionFinal);
    }
    return evaluacionRepository;
};

// Recalcula el promedio de satisfaccion de un trabajador a partir
// de todas sus evaluaciones y lo guarda en Trabajador.promedio_satisfaccion.
// Se llama cada vez que una evaluacion asociada a ese trabajador cambia
// (se crea, se actualiza o se elimina) para que el panel de administracion
// siempre muestre el promedio al dia.
const recalcularPromedioTrabajador = async (id_trabajador) => {
    if (!id_trabajador) return;

    const repo = getRepository();
    const evaluaciones = await repo.findBy({ id_trabajador });

    const trabajadorRepository = db.getRepository('Trabajador');
    if (evaluaciones.length === 0) {
        await trabajadorRepository.update(id_trabajador, { promedio_satisfaccion: null });
        return;
    }

    const suma = evaluaciones.reduce((acumulado, evaluacion) => acumulado + evaluacion.nota, 0);
    const promedio = Number((suma / evaluaciones.length).toFixed(2));
    await trabajadorRepository.update(id_trabajador, { promedio_satisfaccion: promedio });
};

/**
 * crear una nueva evaluacion
 * @param {Object} datosEvaluacion
 * @return {Object}
*/
const crearEvaluacionFinal = async (datosEvaluacion) => {
    const repo = getRepository();
    const nuevaEvaluacion = repo.create(datosEvaluacion);
    const evaluacionCreada = await repo.save(nuevaEvaluacion);
    await recalcularPromedioTrabajador(evaluacionCreada.id_trabajador);
    return evaluacionCreada;
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
    const evaluacionActualizada = await obtenerEvaluacionFinalPorId(id_evaluacion);
    if (evaluacionActualizada) {
        await recalcularPromedioTrabajador(evaluacionActualizada.id_trabajador);
    }
    return evaluacionActualizada;
}

/**
 * eliminar una evaluacion
 * @param {Number} id_evaluacion 
 * @return {Boolean} 
 */

const eliminarEvaluacionFinal = async (id_evaluacion) => {
    const repo = getRepository();
    const evaluacion = await obtenerEvaluacionFinalPorId(id_evaluacion);
    if (!evaluacion) return false;

    const result = await repo.delete(id_evaluacion);
    if (result.affected === 0) {
        return false;
    }
    await recalcularPromedioTrabajador(evaluacion.id_trabajador);
    return true;
};

module.exports = {
    crearEvaluacionFinal,
    obtenerTodasLasEvaluacionFinal,
    obtenerEvaluacionFinalPorId,
    actualizarEvaluacionFinal,
    eliminarEvaluacionFinal,
    recalcularPromedioTrabajador,
};
