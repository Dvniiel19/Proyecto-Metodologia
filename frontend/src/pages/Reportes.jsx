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
    <div className="px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black">Reportes</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen general de la operación</p>
      </header>

      {error && (
        <p className="mb-6 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-300 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-black">Servicios por Estado</h3>
          </div>
          {agenda.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500">No hay servicios registrados.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {Object.entries(porEstado).map(([estado, cantidad]) => (
                <li key={estado} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-700">{estado}</span>
                  <span className="text-sm font-bold text-black">{cantidad}</span>
                </li>
              ))}
              <li className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-semibold text-black">Total</span>
                <span className="text-sm font-bold text-black">{agenda.length}</span>
              </li>
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-gray-300 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-base font-semibold text-black">Evaluaciones por Nota</h3>
          </div>
          {evaluaciones.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500">No hay evaluaciones registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {[5, 4, 3, 2, 1].map((nota) => (
                <li key={nota} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-700">{'★'.repeat(nota)} ({nota})</span>
                  <span className="text-sm font-bold text-black">{porNota[nota] ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-black">
            Promedio de Satisfacción por Trabajador
          </h3>
        </div>
        {rendimiento.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-500">
            Aún no hay servicios evaluados con trabajadores asignados.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 font-semibold text-black">Trabajador</th>
                <th className="px-5 py-3 font-semibold text-black">Evaluaciones</th>
                <th className="px-5 py-3 font-semibold text-black">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rendimiento.map((t) => (
                <tr key={t.id_trabajador}>
                  <td className="px-5 py-3 text-gray-700">
                    {t.nombre} {t.apellido}
                  </td>
                  <td className="px-5 py-3 text-gray-700">{t.total_evaluaciones}</td>
                  <td className="px-5 py-3 font-bold text-black">
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
