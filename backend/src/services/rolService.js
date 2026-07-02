const db = require('../config/db');
const Rol = require('../entities/rol.entity');
const rolRepository = db.getRepository(Rol);

const obtenerRolPorId = async (id_rol) => {
    return await rolRepository.findOneBy({ id_rol: Number(id_rol) });
};

module.exports = {
    obtenerRolPorId,
};
