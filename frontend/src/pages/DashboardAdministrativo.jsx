import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  Eye,
  Pencil,
  AlertTriangle,
  ClipboardList,
  Star,
  PackageSearch,
} from 'lucide-react'
import { api } from '../services/api'
import { fechaHoyChile, fechaLargaHoy } from '../helpers/fechas'

const FECHA_HOY = fechaLargaHoy()

function MetricCard({ label, valor, icon: Icon, alerta }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <Icon className={`h-5 w-5 ${alerta ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>
      <p className={`mt-3 text-3xl font-bold ${alerta ? 'text-red-600' : 'text-black dark:text-white'}`}>
        {valor}
      </p>
    </div>
  )
}

function ServiciosHoyTable({ servicios }) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-gray-300 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <ClipboardList className="h-4 w-4 text-black dark:text-white" />
        <h3 className="text-base font-semibold text-black dark:text-white">Servicios de Hoy</h3>
      </div>

      {servicios.length === 0 ? (
        <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">No hay servicios agendados para hoy.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {servicios.map((servicio) => (
            <li
              key={servicio.id_servicio}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black dark:text-white">
                  Servicio #{servicio.id_servicio}
                  {servicio.id_contrato ? ` — Contrato #${servicio.id_contrato}` : ''}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {servicio.hora_inicio ?? 'Sin hora'}
                  {servicio.hora_fin ? ` – ${servicio.hora_fin}` : ''}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {servicio.estado}
                </span>

                <button
                  type="button"
                  title="Ver detalles"
                  onClick={() => navigate('/agenda')}
                  className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ver
                </button>
                <button
                  type="button"
                  title="Editar servicio"
                  onClick={() => navigate('/agenda')}
                  className="flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AlertasYEvaluacionesPanel({ alertas, evaluaciones }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      {alertas.length === 0 ? (
        <div className="rounded-lg border border-gray-300 bg-white p-5 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay insumos en alerta. Todo en orden.</p>
        </div>
      ) : (
        alertas.map((insumo) => (
          <div key={insumo.id_insumo} className="rounded-lg border border-red-300 bg-white p-5 transition-colors duration-200 dark:border-red-800 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-600 dark:text-red-500">Stock Crítico</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  El insumo{' '}
                  <span className="font-medium text-black dark:text-white">{insumo.nombre_insumo}</span> tiene{' '}
                  {insumo.stock} unidades disponibles.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/insumos')}
                  className="mt-3 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Reabastecer
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="rounded-lg border border-gray-300 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-base font-semibold text-black dark:text-white">Últimas Evaluaciones</h3>
        </div>
        {evaluaciones.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">Aún no hay evaluaciones registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {evaluaciones.slice(-3).reverse().map((ev) => (
              <li key={ev.id_evaluacion} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <p className="text-sm font-medium text-black dark:text-white">
                  Servicio #{ev.id_servicio} — Nota: {ev.nota}/5
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {ev.comentarios || 'Sin comentarios.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function DashboardAdministrativo() {
  const [agenda, setAgenda] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [alertas, setAlertas] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.allSettled([
      api.get('/agenda'),
      api.get('/trabajador'),
      api.get('/insumos/alertas'),
      api.get('/evaluacionFinal'),
    ]).then(([agendaRes, trabRes, alertasRes, evalRes]) => {
      if (agendaRes.status === 'fulfilled') setAgenda(agendaRes.value ?? [])
      if (trabRes.status === 'fulfilled') setTrabajadores(trabRes.value ?? [])
      if (alertasRes.status === 'fulfilled') setAlertas(alertasRes.value ?? [])
      if (evalRes.status === 'fulfilled') setEvaluaciones(evalRes.value ?? [])

      const fallo = [agendaRes, trabRes, alertasRes, evalRes].find(
        (r) => r.status === 'rejected',
      )
      if (fallo) setError(fallo.reason?.message ?? 'Error cargando datos')
    })
  }, [])

  const hoy = fechaHoyChile()
  const serviciosHoy = agenda.filter(
    (s) => String(s.fecha_programada).slice(0, 10) === hoy,
  )
  const promedio =
    evaluaciones.length > 0
      ? (evaluaciones.reduce((acc, ev) => acc + Number(ev.nota), 0) / evaluaciones.length).toFixed(1)
      : '—'

  const metricas = [
    { label: 'Servicios de Hoy', valor: String(serviciosHoy.length), icon: CalendarDays, alerta: false },
    { label: 'Trabajadores Activos', valor: String(trabajadores.length), icon: Users, alerta: false },
    { label: 'Insumos en Alerta', valor: String(alertas.length), icon: PackageSearch, alerta: alertas.length > 0 },
    { label: 'Promedio Evaluaciones', valor: promedio, icon: Star, alerta: false },
  ]

  return (
    <div className="px-8 py-8 transition-colors duration-200">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">{FECHA_HOY}</p>
      </header>

      {error && (
        <p className="mb-6 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ServiciosHoyTable servicios={serviciosHoy} />
        <AlertasYEvaluacionesPanel alertas={alertas} evaluaciones={evaluaciones} />
      </section>
    </div>
  )
}