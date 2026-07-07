// Convierte fechas ISO (2026-07-06 o 2026-07-06T00:00:00.000Z) a DD/MM/YYYY.
// Si el valor no parece una fecha ISO, lo devuelve sin cambios.
export function formatearFecha(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(valor ?? ''))
  return m ? `${m[3]}/${m[2]}/${m[1]}` : valor
}

// Convierte "06/07/2026" (formato chileno, como lo envía el backend) a
// "2026-07-06", que es lo que necesita un <input type="date">.
// Si el valor no calza con DD/MM/YYYY, lo devuelve sin cambios.
export function fechaChileAIso(valor) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(valor ?? ''))
  return m ? `${m[3]}-${m[2]}-${m[1]}` : valor
}
