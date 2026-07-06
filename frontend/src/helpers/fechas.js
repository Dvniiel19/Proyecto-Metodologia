/**
 * Funciones auxiliares de fechas usadas en varias paginas.
 */

/** Fecha de hoy en formato YYYY-MM-DD (para comparar con fecha_programada del backend) */
export function fechaHoyISO() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

/** Fecha de hoy en texto largo en español (ej. "viernes, 4 de julio de 2026") */
export function fechaLargaHoy({ conAnio = true } = {}) {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(conAnio ? { year: 'numeric' } : {}),
  })
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Convierte "2026-06-28" (o un ISO con hora) en "28 de junio, 2026" */
export function formatearFecha(fecha) {
  const soloFecha = String(fecha).slice(0, 10)
  const [anio, mes, dia] = soloFecha.split('-')
  return `${Number(dia)} de ${MESES[Number(mes) - 1]}, ${anio}`
}
