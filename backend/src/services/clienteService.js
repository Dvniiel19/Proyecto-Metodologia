

const db = require('../config/db');
const Cliente = require('../entities/cliente.entity');

const clienteRepository = db.getRepository(Cliente);

/**
 * crear un nuevo cliente
 * @param {Object} datosCliente 
 * @return {Object} 
*/

const crearCliente = async (datosCliente) => {
    const nuevoCliente = clienteRepository.create(datosCliente);
    return await clienteRepository.save(nuevoCliente);
};

/**
 * obtener todos los clientes
 * @return {Array}
 */

const obtenerTodosLosCliente = async () => {
    return await clienteRepository.find();
};

/**
 * obtener cliente por id
 * @param {Number} id_cliente 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const obtenerClientePorId = async (id_cliente) => {
    return await clienteRepository.findOneBy({id_cliente});
};

/**
 * actualizar un cliente existente
 * @param {Number} id_cliente 
 * @param {Object} datosActualizados 
 * @returns {Object | null} 
 */

const actualizarCliente = async (id_cliente, datosActualizados) => {
    await clienteRepository.update(id_cliente,datosActualizados);
    return await obtenerClientePorId(id_cliente);
}

/**
 * eliminar un cliente
 * @param {Number} id_cliente
 * @return {Boolean} 
 */

const eliminarCliente = async (id_cliente) => {
    const result = await clienteRepository.delete(id_cliente);
    if(result.affected ===0) {
        return false;
    }
    return true;
};

module.exports = {
    crearCliente,
    obtenerTodosLosCliente,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
};
