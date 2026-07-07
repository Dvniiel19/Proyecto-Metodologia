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

/** Fecha de hoy en formato chileno DD/MM/YYYY (como la envía el backend) */
export function fechaHoyChile() {
  const [anio, mes, dia] = fechaHoyISO().split('-')
  return `${dia}/${mes}/${anio}`
}

/** Fecha de hoy en texto largo en español (ej. "viernes, 4 de julio de 2026") */
export function fechaLargaHoy({ conAnio = true } = {}) {
  return new Date().toLocaleDateString('es-CL', {
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

/** Convierte "28/06/2026" o "2026-06-28" (con o sin hora) en "28 de junio, 2026" */
export function formatearFecha(fecha) {
  const soloFecha = String(fecha).slice(0, 10)
  let anio, mes, dia
  if (soloFecha.includes('/')) {
    ;[dia, mes, anio] = soloFecha.split('/')
  } else {
    ;[anio, mes, dia] = soloFecha.split('-')
  }
  return `${Number(dia)} de ${MESES[Number(mes) - 1]}, ${anio}`
}
