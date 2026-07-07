import { useCallback, useRef, useState } from 'react'
import { Camera, CheckCircle, X, Eye, Clock, MapPin, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { api, API_URL } from '../services/api'
import useCarga from '../hooks/useCarga'
import { fechaLargaHoy, formatearFecha } from '../helpers/fechas'

const FECHA_HOY = fechaLargaHoy({ conAnio: true })

function ImagePreview({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-black" />
        </button>
        <img
          src={src}
          alt="Evidencia"
          className="max-h-[85vh] rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  )
}

function TareaPendiente({ tarea, onFinalizada }) {
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleFileSelect = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    fileRef.current = archivo
    setPreview(URL.createObjectURL(archivo))
    setError(null)
    setExito(false)
  }

  const handleFinalizar = async () => {
    if (!preview) return
    setSubiendo(true)
    setError(null)
    const formData = new FormData()
    formData.append('foto_evidencia', fileRef.current)

    try {
      await api.putForm(`/tarea/${tarea.id_tarea}/finalizar`, formData)
      setExito(true)
      setPreview(null)
      fileRef.current = null
      setTimeout(() => onFinalizada(), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendo(false)
    }
  }

  const abrirSelector = () => {
    inputRef.current?.click()
  }

  if (exito) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-700">
            Tarea finalizada y enviada a validación
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <h4 className="text-sm font-semibold text-black">{tarea.descripcion}</h4>
      <p className="mt-0.5 text-xs font-medium text-amber-600">
        Estado: {tarea.estado}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="mt-3">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Vista previa"
              className="h-40 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => { setPreview(null); fileRef.current = null; }}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={abrirSelector}
              className="flex items-center gap-1.5 rounded-md border border-gray-400 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-gray-100"
            >
              <Camera className="h-3.5 w-3.5" />
              Cambiar foto
            </button>
            <button
              type="button"
              disabled={subiendo}
              onClick={handleFinalizar}
              className="flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {subiendo ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Subiendo...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Finalizar Tarea
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={abrirSelector}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
          >
            <Camera className="h-5 w-5" />
            Subir Foto de Evidencia
          </button>
          <button
            type="button"
            onClick={abrirSelector}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            📷 Tomar Foto (Cámara)
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function TareaFinalizada({ tarea }) {
  const [lightbox, setLightbox] = useState(false)
  const fotoUrl = tarea.foto_evidencia
    ? tarea.foto_evidencia.startsWith('uploads/')
      ? `${API_URL}/${tarea.foto_evidencia}`
      : `${API_URL}/uploads/evidencias/${tarea.foto_evidencia}`
    : null

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          <div>
            <h4 className="text-sm font-medium text-gray-500 line-through">
              {tarea.descripcion}
            </h4>
            <p className="mt-0.5 text-xs text-gray-400">
              Estado: {tarea.estado}
            </p>
          </div>
        </div>
      </div>

      {fotoUrl && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block h-20 w-20 overflow-hidden rounded-lg border border-gray-300"
          >
            <img
              src={fotoUrl}
              alt="Evidencia"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <Eye className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        </div>
      )}

      {lightbox && fotoUrl && (
        <ImagePreview src={fotoUrl} onClose={() => setLightbox(false)} />
      )}
    </div>
  )
}

function ServicioGroup({ servicio }) {
  const [collapsed, setCollapsed] = useState(false)
  const pendientes = servicio.tareas.filter((t) => t.estado === 'En Proceso')
  const finalizadas = servicio.tareas.filter((t) => t.estado !== 'En Proceso')

  return (
    <div className="rounded-xl border-2 border-black bg-white">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-black">
              Servicio #{servicio.id_servicio}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                servicio.estado_servicio === 'Finalizado'
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : servicio.estado_servicio === 'En Proceso' || servicio.estado_servicio === 'Personal Asignado'
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-gray-100 text-gray-700'
              }`}
            >
              {servicio.estado_servicio}
            </span>
          </div>

          {servicio.cliente && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {servicio.cliente.nombre} {servicio.cliente.apellido}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {servicio.cliente.direccion}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatearFecha(servicio.fecha_programada)}
              </span>
              {servicio.hora_inicio && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {servicio.hora_inicio?.slice(0, 5)}
                  {servicio.hora_fin ? ` – ${servicio.hora_fin.slice(0, 5)}` : ''}
                </span>
              )}
            </div>
          )}

          <p className="mt-1 text-xs text-gray-400">
            Asignado por: {servicio.asignado_por}
          </p>
        </div>

        {collapsed ? (
          <ChevronDown className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
        ) : (
          <ChevronUp className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>

      {!collapsed && (
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="flex flex-col gap-3">
            {pendientes.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pendientes ({pendientes.length})
                </h4>
                <div className="flex flex-col gap-3">
                  {pendientes.map((tarea) => (
                    <TareaPendiente
                      key={tarea.id_tarea}
                      tarea={tarea}
                      onFinalizada={() => window.location.reload()}
                    />
                  ))}
                </div>
              </div>
            )}

            {finalizadas.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Finalizadas ({finalizadas.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {finalizadas.map((tarea) => (
                    <TareaFinalizada key={tarea.id_tarea} tarea={tarea} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MisTareas() {
  const [servicios, setServicios] = useState([])

  const cargarDatos = useCallback(async () => {
    const data = await api.get('/tarea/mis-tareas')
    setServicios(Array.isArray(data) ? data : [])
  }, [])

  const { cargando, error, recargar } = useCarga(cargarDatos)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black">Mis Tareas Asignadas</h1>
          <p className="mt-1 text-sm capitalize text-gray-500">{FECHA_HOY}</p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-white p-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={recargar}
              className="mt-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
              <p className="text-sm text-gray-500">Cargando tareas...</p>
            </div>
          </div>
        ) : servicios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CheckCircle className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              No tienes tareas asignadas por el momento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {servicios.map((servicio) => (
              <ServicioGroup key={servicio.id_servicio} servicio={servicio} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
