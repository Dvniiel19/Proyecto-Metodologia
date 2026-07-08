// Pagina "Mis Tareas" (rol Trabajador): muestra sus servicios asignados
// agrupados por jornada, y permite finalizar cada tarea subiendo la foto de
// evidencia obligatoria (requisito de evidencia y notificacion al cliente).
import { useCallback, useRef, useState } from 'react'
import { Camera, CheckCircle, MapPin, User, Clock } from 'lucide-react'
import { api, API_URL } from '../services/api'
import useCarga from '../hooks/useCarga'
import { fechaLargaHoy } from '../helpers/fechas'

const FECHA_HOY = fechaLargaHoy({ conAnio: false })

// Tarea "En Proceso": el boton abre el selector de archivos y al elegir la
// foto se sube de inmediato, finalizando la tarea
function TareaPendiente({ tarea, onFinalizada }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  // Al seleccionar la imagen: se arma un FormData (multipart) y se envia al
  // endpoint de finalizar; el backend guarda la evidencia, cambia el estado a
  // "Pendiente de Validación" y notifica por correo al cliente
  const handleFileChange = async (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setSubiendo(true) // bloquea los botones para evitar doble subida
    setError(null)
    const formData = new FormData()
    formData.append('foto_evidencia', archivo)

    try {
      await api.putForm(`/tarea/${tarea.id_tarea}/finalizar`, formData)
      onFinalizada()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendo(false)
      e.target.value = '' // limpia el input para poder reintentar con la misma foto
    }
  }

  return (
    // Oscurecemos el fondo de la tarea a gris-800 para que resalte dentro del grupo gris-900
    <div className="rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="text-sm font-semibold text-black dark:text-white">{tarea.descripcion}</h4>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden" 
      />

      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
        className="mt-3 w-full rounded-lg bg-green-600 py-2.5 text-xs font-semibold text-white transition-colors active:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
      >
        {subiendo ? 'Subiendo evidencia...' : 'Subir Foto y Finalizar'}
      </button>

      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-400 py-3 text-center transition-colors disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
      >
        <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Abrir galería
        </span>
      </button>

      {error && (
        <p className="mt-2 rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// Tarea ya finalizada: se muestra tachada, con enlace a su evidencia
function TareaFinalizada({ tarea }) {
  return (
    // Las tareas finalizadas se ven un poco más translúcidas/apagadas en modo oscuro
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-500 line-through dark:text-gray-400">
          {tarea.descripcion}
        </h4>
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
      </div>

      {tarea.foto_evidencia && (
        <a
          href={
            tarea.foto_evidencia.startsWith('uploads/')
              ? `${API_URL}/${tarea.foto_evidencia}`
              : `${API_URL}/uploads/evidencias/${tarea.foto_evidencia}`
          }
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          Ver evidencia
        </a>
      )}
    </div>
  )
}

// Tarjeta de una jornada/servicio: cabecera con fecha, cliente y direccion,
// y adentro sus tareas separadas en pendientes y finalizadas
function GrupoServicio({ grupo, onTareaFinalizada }) {
  const pendientes = grupo.tareas.filter((t) => t.estado === 'En Proceso')
  const finalizadas = grupo.tareas.filter((t) => t.estado !== 'En Proceso')

  return (
    // Contenedor principal del servicio (Gris-900)
    <div className="rounded-xl border-2 border-black bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
          {grupo.fecha_programada && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {grupo.fecha_programada}
            </span>
          )}
          {grupo.cliente && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {grupo.cliente.nombre} {grupo.cliente.apellido}
            </span>
          )}
          {grupo.cliente?.direccion && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {grupo.cliente.direccion}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {grupo.tareas.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Este servicio aún no tiene tareas registradas.
          </p>
        )}
        {pendientes.map((tarea) => (
          <TareaPendiente
            key={tarea.id_tarea}
            tarea={tarea}
            onFinalizada={onTareaFinalizada}
          />
        ))}
        {finalizadas.map((tarea) => (
          <TareaFinalizada key={tarea.id_tarea} tarea={tarea} />
        ))}
      </div>
    </div>
  )
}

export default function MisTareas() {
  const [agrupado, setAgrupado] = useState([])
  const [mensajeExito, setMensajeExito] = useState(null)

  const cargarDatos = useCallback(async () => {
    const data = await api.get('/tarea/mis-tareas')
    setAgrupado(Array.isArray(data) ? data : [])
  }, [])

  const { cargando, error, recargar: cargar } = useCarga(cargarDatos)

  // Tras finalizar una tarea: confirma al trabajador y recarga la lista
  const handleTareaFinalizada = useCallback(() => {
    setMensajeExito('Tarea finalizada. Se notificó al cliente para su validación.')
    setTimeout(() => setMensajeExito(null), 5000)
    cargar()
  }, [cargar])

  // true si queda al menos una tarea en proceso (controla el mensaje final)
  const todosPendientes = agrupado.some((g) =>
    g.tareas.some((t) => t.estado === 'En Proceso'),
  )

  return (
    // Agregamos dark:bg-transparent para que herede el fondo oscuro del Layout en vez de forzar un blanco
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-transparent">
      <div className="mx-auto max-w-md px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Mis Tareas</h1>
          <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">{FECHA_HOY}</p>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando tareas...</p>
        ) : agrupado.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tienes tareas asignadas.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {agrupado.map((grupo) => (
              <GrupoServicio
                key={grupo.id_servicio}
                grupo={grupo}
                onTareaFinalizada={handleTareaFinalizada}
              />
            ))}

            {!todosPendientes && agrupado.length > 0 && (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Todas las tareas han sido finalizadas.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}