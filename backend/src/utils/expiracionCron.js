// backend/src/utils/expiracionCron.js
const cron = require('node-cron');
const { getRepository, LessThanOrEqual } = require('typeorm');

function iniciarVerificacionRoles() {
    // Se ejecuta todos los días a las 00:00 (Medianoche)
    cron.schedule('0 0 0 * * *', async () => {
        console.log('--- Verificando expiración de roles automáticamente ---');
        try {
            const usuarioRepository = getRepository("Usuario");
            const hoy = new Date();

            const usuariosExpirados = await usuarioRepository.find({
                where: {
                    estado_rol: 'Activo',
                    fecha_expiracion: LessThanOrEqual(hoy)
                }
            });

            for (let usuario of usuariosExpirados) {
                usuario.estado_rol = 'Rol expirado';
                await usuarioRepository.save(usuario);
                console.log(`[AUTOMÁTICO] Rol del usuario ${usuario.correo} ha expirado.`);
            }
        } catch (error) {
            console.error('Error en tarea programada:', error);
        }
    });
}

module.exports = { iniciarVerificacionRoles };