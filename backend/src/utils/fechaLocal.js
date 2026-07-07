/**
 * Fecha de hoy en formato YYYY-MM-DD usando la hora LOCAL del servidor.
 * No usar toISOString(): trabaja en UTC y de noche devolveria el dia siguiente.
 */
const fechaHoyLocal = () => {
    const ahora = new Date();
    return [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, '0'),
        String(ahora.getDate()).padStart(2, '0'),
    ].join('-');
};

module.exports = { fechaHoyLocal };
