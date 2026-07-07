import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function Reportes() {
  const [agenda, setAgenda] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [rendimiento, setRendimiento] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.allSettled([
      api.get('/agenda'),
      api.get('/evaluacionFinal'),
      // promedio de satisfaccion por trabajador, calculado con AVG en SQL
      api.get('/reportes/rendimiento'),
    ]).then(([agendaRes, evalRes, rendRes]) => {
      if (agendaRes.status === 'fulfilled') setAgenda(agendaRes.value ?? [])
      if (evalRes.status === 'fulfilled') setEvaluaciones(evalRes.value ?? [])
      if (rendRes.status === 'fulfilled') setRendimiento(rendRes.value ?? [])
      const fallo = [agendaRes, evalRes, rendRes].find((r) => r.status === 'rejected')
      if (fallo) setError(fallo.reason?.message ?? 'Error cargando datos')
    })
  }, [])

  const porEstado = agenda.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] ?? 0) + 1
    return acc
  }, {})

  const porNota = evaluaciones.reduce((acc, ev) => {
    acc[ev.nota] = (acc[ev.nota] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="px-8 py-8 transition-colors duration-200">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Reportes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Resumen general de la operación</p>
      </header>

      {error && (
        <p className="mb-6 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PANEL: SERVICIOS POR ESTADO */}
        <div className="rounded-lg border border-gray-300 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <h3 className="text-base font-semibold text-black dark:text-white">Servicios por Estado</h3>
          </div>
          {agenda.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">No hay servicios registrados.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(porEstado).map(([estado, cantidad]) => (
                <li key={estado} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{estado}</span>
                  <span className="text-sm font-bold text-black dark:text-white">{cantidad}</span>
                </li>
              ))}
              <li className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-semibold text-black dark:text-white">Total</span>
                <span className="text-sm font-bold text-black dark:text-white">{agenda.length}</span>
              </li>
            </ul>
          )}
        </div>

        {/* PANEL: EVALUACIONES POR NOTA */}
        <div className="rounded-lg border border-gray-300 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <h3 className="text-base font-semibold text-black dark:text-white">Evaluaciones por Nota</h3>
          </div>
          {evaluaciones.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">No hay evaluaciones registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[5, 4, 3, 2, 1].map((nota) => (
                <li key={nota} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{'★'.repeat(nota)} ({nota})</span>
                  <span className="text-sm font-bold text-black dark:text-white">{porNota[nota] ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PANEL: PROMEDIO DE SATISFACCIÓN (TABLA) */}
      <div className="mt-6 rounded-lg border border-gray-300 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-base font-semibold text-black dark:text-white">
            Promedio de Satisfacción por Trabajador
          </h3>
        </div>
        {rendimiento.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">
            Aún no hay servicios evaluados con trabajadores asignados.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 font-semibold text-black dark:text-white">Trabajador</th>
                <th className="px-5 py-3 font-semibold text-black dark:text-white">Evaluaciones</th>
                <th className="px-5 py-3 font-semibold text-black dark:text-white">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rendimiento.map((t) => (
                <tr key={t.id_trabajador} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {t.nombre} {t.apellido}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{t.total_evaluaciones}</td>
                  <td className="px-5 py-3 font-bold text-black dark:text-white">
                    {'★'.repeat(Math.round(t.promedio_satisfaccion))} ({t.promedio_satisfaccion})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}