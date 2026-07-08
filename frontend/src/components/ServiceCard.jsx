// ServiceCard: tarjeta de un servicio en la vista del Cliente ("Mis Servicios").
// Segun el estado del servicio decide que mostrar: mensaje de espera (en proceso),
// formulario de evaluacion (pendiente) o la nota ya registrada (con editar/eliminar).
import { useState } from 'react'
import StarRating from './StarRating'

// Etiqueta visual del estado del servicio
function EstadoBadge({ estado, label }) {
  const texto = label ?? (estado === 'en_proceso' ? 'En Proceso' : 'Finalizado')
  return (
    <span className="rounded-full border border-black px-3 py-1 text-xs font-medium text-black">
      {texto}
    </span>
  )
}

// Formulario de nota + comentario; se reutiliza para evaluar por primera vez
// y para editar una evaluacion existente (por eso recibe valores iniciales)
function EvaluationForm({ initialRating = 0, initialComment = '', onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)

  // No se puede enviar sin al menos 1 estrella; el comentario es opcional
  const canSubmit = rating > 0

  return (
    <div className="mt-4 border-t border-gray-300 pt-4">
      <p className="mb-2 text-sm font-medium text-black">Calificación</p>
      <StarRating value={rating} onChange={setRating} />

      <label className="mt-4 block text-sm font-medium text-black">
        Agregar Comentarios (opcional)
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Observaciones sobre el servicio..."
          className="mt-1 w-full resize-none rounded-md border border-gray-400 p-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
        />
      </label>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ rating, comment })}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          Enviar Evaluación
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-400 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}

export default function ServiceCard({ service, onEvaluate, onDelete }) {
  const [editing, setEditing] = useState(false)

  // Reglas de la tarjeta: solo se evalua un servicio finalizado; si ya tiene
  // calificacion se muestra en modo lectura con opcion de editar
  const yaEvaluado = service.estado === 'finalizado' && service.calificacion != null
  const pendienteEvaluar = service.estado === 'finalizado' && service.calificacion == null
  const enProceso = service.estado === 'en_proceso'

  // Delega el guardado a la pagina padre (que llama a la API) y cierra el modo edicion
  const handleSubmit = ({ rating, comment }) => {
    onEvaluate(service.id, { calificacion: rating, comentario: comment })
    setEditing(false)
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-black">{service.nombre}</h3>
          <p className="text-sm text-gray-500">{service.fecha}</p>
        </div>
        <EstadoBadge estado={service.estado} label={service.estadoLabel} />
      </div>

      {enProceso && (
        <p className="mt-4 text-sm text-gray-500">
          La evaluación se habilitará al finalizar el servicio.
        </p>
      )}

      {pendienteEvaluar && (
        <EvaluationForm onSubmit={handleSubmit} />
      )}

      {yaEvaluado && !editing && (
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border-t border-gray-300 pt-4">
          <div>
            <StarRating value={service.calificacion} readOnly />
            {service.comentario ? (
              <p className="mt-2 text-sm text-gray-700">{service.comentario}</p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">Sin comentarios.</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(service.id)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {yaEvaluado && editing && (
        <EvaluationForm
          initialRating={service.calificacion}
          initialComment={service.comentario}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  )
}
