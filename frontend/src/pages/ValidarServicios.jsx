// Pagina "Validar Servicios" (rol Cliente): muestra las tareas que el
// trabajador finalizo con evidencia y permite al cliente aprobar o rechazar
// cada una. El backend ya filtra por titularidad: solo llegan tareas de SUS contratos.
import { useCallback, useState } from 'react'
import { CheckCircle, XCircle, Clock, User, Camera, Search } from 'lucide-react'
import { api, API_URL } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useCarga from '../hooks/useCarga'
import { formatearFecha } from '../helpers/fechas'

// Tarjeta de una tarea pendiente: enlace a la foto de evidencia + botones Aprobar/Rechazar
function TareaPendiente({ tarea, onValidar }) {
  const [guardando, setGuardando] = useState(false)

  // Envia la decision del cliente ('aprobado' | 'rechazado') al backend
  const handleValidar = async (accion) => {
    setGuardando(true)
    try {
      await api.put(`/tarea/${tarea.id_tarea}/validar-cliente`, { accion })
      onValidar()
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  // Construye la URL de la foto; soporta rutas antiguas (solo nombre de archivo)
  // y nuevas (con prefijo uploads/)
  const rutaEvidencia = tarea.foto_evidencia
    ? tarea.foto_evidencia.startsWith('uploads/')
      ? `${API_URL}/${tarea.foto_evidencia}`
      : `${API_URL}/uploads/evidencias/${tarea.foto_evidencia}`
    : null

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-black dark:text-white">
            {tarea.descripcion || `Tarea #${tarea.id_tarea}`}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {tarea.fecha_servicio && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatearFecha(tarea.fecha_servicio)}
              </span>
            )}
            {tarea.trabajador && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {tarea.trabajador}
              </span>
            )}
            <span className="rounded-full border border-amber-500 px-2 py-0.5 text-amber-700 dark:text-amber-400">
              Pendiente de Validación
            </span>
          </div>

          {rutaEvidencia && (
            <a
              href={rutaEvidencia}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Camera className="h-3.5 w-3.5" />
              Ver evidencia
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          disabled={guardando}
          onClick={() => handleValidar('aprobado')}
          className="flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
        >
          <CheckCircle className="h-4 w-4" />
          Aprobar
        </button>
        <button
          type="button"
          disabled={guardando}
          onClick={() => handleValidar('rechazado')}
          className="flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
        >
          <XCircle className="h-4 w-4" />
          Rechazar
        </button>
      </div>
    </div>
  )
}

// Tarjeta de solo lectura para el historial: tareas ya aprobadas o rechazadas
function TareaValidada({ tarea }) {
  const esAprobada = tarea.estado === 'Aprobado'

  const rutaEvidencia = tarea.foto_evidencia
    ? tarea.foto_evidencia.startsWith('uploads/')
      ? `${API_URL}/${tarea.foto_evidencia}`
      : `${API_URL}/uploads/evidencias/${tarea.foto_evidencia}`
    : null

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-500 line-through dark:text-gray-400">
            {tarea.descripcion || `Tarea #${tarea.id_tarea}`}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
            {tarea.fecha_servicio && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatearFecha(tarea.fecha_servicio)}
              </span>
            )}
            {tarea.trabajador && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {tarea.trabajador}
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                esAprobada
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {tarea.estado}
            </span>
          </div>

          {rutaEvidencia && (
            <a
              href={rutaEvidencia}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-gray-400 underline hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Ver evidencia
            </a>
          )}
        </div>
        {esAprobada ? (
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        )}
      </div>
    </div>
  )
}

export default function ValidarServicios() {
  const { usuario } = useAuth()
  const [tareas, setTareas] = useState([])
  const [mensajeExito, setMensajeExito] = useState(null)

  const cargarDatos = useCallback(async () => {
    const data = await api.get('/tarea/pendientes-cliente')
    setTareas(Array.isArray(data) ? data : [])
  }, [])

  const { cargando, error, recargar: cargar } = useCarga(cargarDatos)

  // Tras validar: muestra confirmacion temporal (5s) y recarga la lista
  const handleValidar = useCallback(() => {
    setMensajeExito('Tarea validada correctamente.')
    setTimeout(() => setMensajeExito(null), 5000)
    cargar()
  }, [cargar])

  // Separa la lista en dos secciones: por validar e historial
  const pendientes = tareas.filter((t) => t.estado === 'Pendiente de Validación')
  const validadas = tareas.filter((t) => t.estado !== 'Pendiente de Validación')

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Validar Servicios</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Revisa las tareas finalizadas por el trabajador y aprueba o rechaza el trabajo.
          </p>
        </header>

        {error && (
          <p className="mb-4 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}

        {mensajeExito && (
          <p className="mb-4 flex items-center gap-1.5 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {mensajeExito}
          </p>
        )}

        {cargando ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando tareas pendientes...</p>
        ) : pendientes.length === 0 && validadas.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tienes tareas pendientes de validación.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendientes.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-black dark:text-white">
                  Pendientes de Validación ({pendientes.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {pendientes.map((tarea) => (
                    <TareaPendiente
                      key={tarea.id_tarea}
                      tarea={tarea}
                      onValidar={handleValidar}
                    />
                  ))}
                </div>
              </section>
            )}

            {validadas.length > 0 && (
              <section className="mt-2">
                <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Historial de Validaciones ({validadas.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {validadas.map((tarea) => (
                    <TareaValidada key={tarea.id_tarea} tarea={tarea} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
