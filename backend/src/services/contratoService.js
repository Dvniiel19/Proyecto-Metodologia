

const db = require('../config/db');
const Contrato = require('../entities/contrato.entity');

const contratoRepository = db.getRepository(Contrato);

/**
 * crear un nuevo contrato
 * @param {Object} datosContrato 
 * @return {Object} 
*/

const crearContrato = async (datosContrato) => {
    const nuevoContrato = contratoRepository.create(datosContrato);
    return await contratoRepository.save(nuevoContrato);
};

/**
 * obtener todos los contratos
 * @return {Array} 
 */

const obtenerTodosLosContratos = async () => {
    const contratos = await contratoRepository.find({ relations: ['cliente'] });
    return contratos.map(c => ({
    ...c, // para incluir todos los campos del contrato
    nombre_cliente: c.cliente ? `${c.cliente.nombre} ${c.cliente.apellido}` : '—',
}));
};

/**
 * obtener contrato por id
 * @param {Number} id_contrato 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerContratoPorId = async (id_contrato) => {
    const contrato = await contratoRepository.findOne({
    where: { id_contrato },
    relations: ['cliente'],
});
if (!contrato) return null;
return {
    ...contrato, 
    // Para mostrar en el front el nombre completo del cliente asociado al contrato 
    nombre_cliente: contrato.cliente ? `${contrato.cliente.nombre} ${contrato.cliente.apellido}` : '—',
    
};
};

/**
 * actualizar un contrato existente
 * @param {Number} id_contrato 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarContrato = async (id_contrato, datosActualizados) => {
    await contratoRepository.update(id_contrato,datosActualizados);
    return await obtenerContratoPorId(id_contrato);
}

/**
 * eliminar un contrato
 * @param {Number} id_contrato 
 * @return {Boolean} 
 */

const eliminarContrato= async (id_contrato) => {
    const result = await contratoRepository.delete(id_contrato);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearContrato,
    obtenerTodosLosContratos,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato,
};
