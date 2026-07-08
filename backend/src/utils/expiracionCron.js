// backend/src/utils/expiracionCron.js
// Tarea programada (node-cron) que expira roles vencidos automaticamente.
// Es complementaria al middleware de autorizacion: el middleware bloquea al
// usuario en cada peticion, y este cron deja el estado persistido en la BD
// aunque el usuario nunca vuelva a entrar.
const cron = require('node-cron');
const { getRepository, LessThanOrEqual } = require('typeorm');

function iniciarVerificacionRoles() {
    // Se ejecuta todos los días a las 00:00 (Medianoche)
    cron.schedule('0 0 0 * * *', async () => {
        console.log('--- Verificando expiración de roles automáticamente ---');
        try {
            const usuarioRepository = getRepository("Usuario");
            const hoy = new Date();

            // Busca usuarios con rol Activo cuya fecha de expiracion ya paso
            // (LessThanOrEqual = fecha_expiracion <= hoy)
            const usuariosExpirados = await usuarioRepository.find({
                where: {
                    estado_rol: 'Activo',
                    fecha_expiracion: LessThanOrEqual(hoy)
                }
            });

            // A cada uno se le marca el rol como expirado; a partir de aqui el
            // middleware le bloqueara todas las acciones hasta que el admin lo renueve
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