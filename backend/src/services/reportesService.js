

const db = require('../config/db');

/**
 * rendimiento de los trabajadores para el dashboard
 * Calcula el promedio de satisfaccion AL VUELO con AVG de SQL, en una sola
 * consulta agregada, en lugar de mantener promedios estaticos por fila:
 *
 *   Trabajador -> asignar_servicio -> Agenda -> EvaluacionFinal
 *
 * Cada trabajador hereda la nota de todos los servicios evaluados en los que
 * participo. Los trabajadores sin evaluaciones no aparecen (INNER JOIN).
 * @return {Array} [{ id_trabajador, nombre, apellido, total_evaluaciones, promedio_satisfaccion }]
 */

const obtenerRendimientoTrabajadores = async () => {
    const filas = await db.getRepository('Trabajador')
        .createQueryBuilder('trabajador')
        .innerJoin('trabajador.asignar_servicio', 'asignacion')
        .innerJoin('asignacion.agenda', 'agenda')
        .innerJoin('agenda.evaluacion_final', 'evaluacion')
        .select('trabajador.id_trabajador', 'id_trabajador')
        .addSelect('trabajador.nombre', 'nombre')
        .addSelect('trabajador.apellido', 'apellido')
        .addSelect('COUNT(DISTINCT evaluacion.id_evaluacion)', 'total_evaluaciones')
        .addSelect('ROUND(AVG(evaluacion.nota), 2)', 'promedio_satisfaccion')
        .groupBy('trabajador.id_trabajador')
        .addGroupBy('trabajador.nombre')
        .addGroupBy('trabajador.apellido')
        .orderBy('promedio_satisfaccion', 'DESC')
        .getRawMany();

    // AVG y COUNT llegan como string desde Postgres: se convierten a numero
    return filas.map((fila) => ({
        ...fila,
        total_evaluaciones: Number(fila.total_evaluaciones),
        promedio_satisfaccion: Number(fila.promedio_satisfaccion),
    }));
};

module.exports = {
    obtenerRendimientoTrabajadores,
};
