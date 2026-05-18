/* servicio de rol contiene la logica de negocio para manejar 
los roles de los usuarios */

const db = require('../config/db');
const Cliente = require('../entities/rol.entity');

const clienteRepository = db.getRepository(Cliente);

/**
 * crear un nuevo usuario
 * @param {Object} datosCliente - { id, nombre, telefono, historial}
 * @return {Object} el rol creado
*/

const crearCliente = async (datosCliente) => {
    const nuevoCliente = clienteRepository.create(datosCliente);
    return await clienteRepository.save(nuevoCliente);
};

/**
 * obtener todos los roles
 * @return {Array} array de todos los rol
 */

const obtenerTodosLosCliente = async () => {
    return await clienteRepository.find();
    return [];
};

/**
 * obtener rol por id
 * @param {Number} id_cliente - ID del rol
 * @param {Object} datosActualizados - campos a actualizar
 * @returns {Object | null} rol encontrato o null
 */

const obtenerClientePorId = async (id_cliente) => {
    return await clienteRepository.findOneBy({id_cliente});
    return null;
};

/**
 * actualizar un rol existente
 * @param {Number} id_cliente - id del rol
 * @param {Objetct} datosActualizados - campos a actualizar
 * @returns {Object | null} -el rol actualizado o null si no existe  
 */

const actualizarCliente = async (id_cliente, datosActualizados) => {
    await clienteRepository.update(id_cliente,datosActualizados);
    return await obtenerClientePorId(id_cliente);
    //return null;
}

/**
 * eliminar un rol
 * @param {Number} id - id del rol
 * @return {Boolean} true si se elimino, false si no existe
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
