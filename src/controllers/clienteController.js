const { sendSuccess, sendError } = require('../handlers/responseHandler');
const clienteService = require('../services/clienteService');
const { createClienteSchema, updateClienteSchema } = require('../validations/clienteValidation');

/** post /cliente
 * crear un nuevo cliente
 */
const crearCliente = async (req, res) => {
    try {
        // validamos los datos de entrada con joi
        const { error, value } = createClienteSchema.validate(req.body);
        if (error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                error.details.map(err => err.message)
            );
        }
        // llamamos al servicio para crear el cliente
        const clienteCreado = await clienteService.crearCliente(value);
        // respondemos con exito
        return sendSuccess(
            res,
            clienteCreado,
            'cliente creado con exito',
            201
        );
    } catch (error) {
        console.error(error);
        return sendError(res, 'Error al crear el cliente', 500);
    }
};

/** get /cliente
 * obtiene todos los clientes
 */
const obtenerTodosLosCliente = async (req, res) => {
    try {
        const cliente = await clienteService.obtenerTodosLosCliente();
        return sendSuccess(res, cliente, 'cliente obtenidos exitosamente');
    } catch (error) {
        return sendError(res, 'Error al obtener cliente', 500);
    }
};

/** get /cliente/:id
 * obtiene un cliente especifico por id
 */
const obtenerClientePorId = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        // llamar al servicio obtenerclientePorId(id_cliente)
        const cliente = await clienteService.obtenerClientePorId(id_cliente); 
        
        // si no existe retrona el error 404
        if (!cliente) {
            return sendError(res, 'cliente no encontrado', 404);
        } else {
            return sendSuccess(res, cliente, 'cliente obtenido correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al obtener el cliente', 500);
    }
};

/** patch /cliente/:id
 * actualizar cliente
 */
const actualizarCliente = async (req, res) => {
    try {
        const validacion = updateClienteSchema.validate(req.body);
        
        // Verificamos si el joi encontro errores de validacion
        if (validacion.error) {
            return sendError(
                res,
                'Error de validacion de datos',
                400,
                validacion.error.details.map(err => err.message)
            );
        }

        const obtenerid = req.params.id_cliente;
        const resultado = await clienteService.actualizarCliente(obtenerid, validacion.value);
    
        if (!resultado) {
            return sendError(res, 'cliente no encontrado', 404);
        } else {
            return sendSuccess(res, resultado, 'cliente actualizado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al actualizar cliente', 500);
    }
};

/** delete /cliente/:id
 * eliminar cliente
 */
const eliminarCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        // llamar al servicio eliminarcliente(id_cliente)
        const eliminado = await clienteService.eliminarCliente(id_cliente);
        
        // si no se elimino retornar error 404
        if (!eliminado) {
            return sendError(res, 'cliente no encontrado', 404);
        } else {
            return sendSuccess(res, null, 'cliente eliminado correctamente');
        }
    } catch (error) {
        return sendError(res, 'Error al eliminar cliente', 500);
    }
};

module.exports = {
    crearCliente,
    obtenerTodosLosCliente,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
};