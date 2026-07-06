import { useCallback, useRef, useState } from 'react'
import { Camera, CheckCircle } from 'lucide-react'
import { api, API_URL } from '../services/api'
import useCarga from '../hooks/useCarga'
import { fechaLargaHoy } from '../helpers/fechas'

const FECHA_HOY = fechaLargaHoy({ conAnio: false })

function TareaPendiente({ tarea, onFinalizada }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = async (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setSubiendo(true)
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
      e.target.value = ''
    }
  }

  return (
    <div className="rounded-xl border-2 border-black bg-white p-4">
      <h3 className="text-base font-semibold text-black">{tarea.descripcion}</h3>
      <p className="mt-1 text-sm text-gray-500">{tarea.estado}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
        className="mt-4 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-colors active:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
      >
        {subiendo ? 'Subiendo evidencia...' : '📷 Subir Foto y Finalizar'}
      </button>

      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-black py-4 text-center disabled:opacity-50"
      >
        <Camera className="h-5 w-5 text-black" />
        <span className="text-xs font-medium text-black">
          Toca aquí para abrir la cámara o galería
        </span>
      </button>

      {error && (
        <p className="mt-3 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function TareaFinalizada({ tarea }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-gray-100 p-4">
      <h3 className="text-base font-medium text-gray-500 line-through">
        {tarea.descripcion}
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 shrink-0 text-gray-400" />
        <p className="text-sm text-gray-500">Evidencia enviada al supervisor</p>
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
          className="mt-2 inline-block text-xs text-gray-500 underline"
        >
          Ver foto de evidencia
        </a>
      )}
    </div>
  )
}

export default function MisTareas() {
  const [tareas, setTareas] = useState([])

  const cargarDatos = useCallback(async () => {
    const data = await api.get('/tarea')
    setTareas(Array.isArray(data) ? data : [])
  }, [])

  const { cargando, error, recargar: cargar } = useCarga(cargarDatos)

  const pendientes = tareas.filter((t) => t.estado === 'En Proceso')
  const finalizadas = tareas.filter((t) => t.estado !== 'En Proceso')

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black">Mis Tareas</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">{FECHA_HOY}</p>
        </header>

        {error && (
          <p className="mb-4 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando tareas...</p>
        ) : tareas.length === 0 ? (
          <p className="text-sm text-gray-500">No tienes tareas asignadas.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendientes.map((tarea) => (
              <TareaPendiente key={tarea.id_tarea} tarea={tarea} onFinalizada={cargar} />
            ))}
            {finalizadas.map((tarea) => (
              <TareaFinalizada key={tarea.id_tarea} tarea={tarea} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}