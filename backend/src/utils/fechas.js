/**
 * Utilidades de fechas para respuestas y entradas de la API.
 * La base de datos sigue guardando fechas ISO (YYYY-MM-DD), pero hacia el
 * cliente todo sale en formato chileno (DD/MM/YYYY) y también se acepta
 * ese formato como entrada.
 */

const RE_ISO = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const RE_CHILE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

// "2026-07-06" = "06/07/2026"; "2026-07-06T15:30:00Z" ="06/07/2026 15:30"
function aFormatoChile(valor) {
  if (valor instanceof Date) {
    const dia = String(valor.getDate()).padStart(2, '0');
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    const base = `${dia}/${mes}/${valor.getFullYear()}`;
    const conHora = valor.getHours() !== 0 || valor.getMinutes() !== 0;
    return conHora
      ? `${base} ${String(valor.getHours()).padStart(2, '0')}:${String(valor.getMinutes()).padStart(2, '0')}`
      : base;
  }
  if (typeof valor !== 'string') return valor;
  const m = RE_ISO.exec(valor);
  if (!m) return valor;
  const base = `${m[3]}/${m[2]}/${m[1]}`;
  return m[4] ? `${base} ${m[4]}:${m[5]}` : base;
}

// Recorre la respuesta y convierte toda fecha (Date o string ISO) a formato chileno (dia,mes,año)
function formatearFechasChile(data) {
  if (data instanceof Date || typeof data === 'string') return aFormatoChile(data);
  if (Array.isArray(data)) return data.map(formatearFechasChile);
  if (data !== null && typeof data === 'object') {
    const salida = {};
    for (const [clave, valor] of Object.entries(data)) {
      salida[clave] = formatearFechasChile(valor);
    }
    return salida;
  }
  return data;
}

// Convierte in-place los strings "DD/MM/YYYY" del body a ISO para que las
// validaciones Joi (.iso()) y la base de datos los acepten
function normalizarFechasBody(obj) {
  if (obj === null || typeof obj !== 'object') return;
  for (const [clave, valor] of Object.entries(obj)) {
    if (typeof valor === 'string') {
      const m = RE_CHILE.exec(valor);
      if (m) obj[clave] = `${m[3]}-${m[2]}-${m[1]}`;
    } else {
      normalizarFechasBody(valor);
    }
  }
}

module.exports = {
  aFormatoChile,
  formatearFechasChile,
  normalizarFechasBody,
};
