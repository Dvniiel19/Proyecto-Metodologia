const { sendSuccess, sendError } = require('../handlers/responseHandler');
const reportesService = require('../services/reportesService');

/** get /reportes/rendimiento
 * rendimiento de trabajadores para el dashboard: promedio de satisfaccion
 * y total de evaluaciones, calculados al vuelo con agregacion SQL
 */
const obtenerRendimiento = async (req, res) => {
    try {
        const rendimiento = await reportesService.obtenerRendimientoTrabajadores();
        return sendSuccess(res, rendimiento, 'rendimiento de trabajadores obtenido exitosamente');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al obtener el rendimiento de trabajadores', 500);
    }
};

module.exports = {
    obtenerRendimiento,
};
