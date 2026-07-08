// Pagina "Mis Servicios" (rol Cliente): historial de servicios contratados con
// la opcion de evaluar (nota 1-5 + comentario) los que ya fueron terminados.
// Cumple el requisito de evaluacion del cliente.
import { useCallback, useState } from 'react'
import ServiceCard from '../components/ServiceCard'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useCarga from '../hooks/useCarga'
import { formatearFecha } from '../helpers/fechas'

// 'Pendiente de Evaluacion' = trabajo terminado, esperando la nota del cliente.
// 'Finalizado'/'Completado' se mantienen para poder ver/editar evaluaciones ya hechas.
const ESTADOS_EVALUABLES = ['Pendiente de Evaluacion', 'Finalizado', 'Completado']

export default function HistorialEvaluaciones() {
  const { usuario } = useAuth()
  const [servicios, setServicios] = useState([])
  const [sinCliente, setSinCliente] = useState(false)
  // error de envio/edicion/borrado de evaluaciones (el de carga lo maneja useCarga)
  const [errorAccion, setErrorAccion] = useState(null)

  const cargarDatos = useCallback(async () => {
    const [clientes, contratos, agenda, evaluaciones] = await Promise.all([
      api.get('/cliente'),
      api.get('/contrato'),
      api.get('/agenda'),
      api.get('/evaluacionFinal'),
    ])

    // Buscar el registro de cliente vinculado al usuario logueado
    const miCliente = (clientes ?? []).find((c) => c.id_usuario === usuario.id_usuario)
    if (!miCliente) {
      setSinCliente(true)
      setServicios([])
      return
    }

    // Filtro de titularidad en cliente: solo los contratos de este cliente
    const misContratos = (contratos ?? [])
      .filter((c) => c.id_cliente === miCliente.id_cliente)
      .map((c) => c.id_contrato)

    // Indice id_servicio -> evaluacion para cruzar en O(1)
    const evalPorServicio = {}
    ;(evaluaciones ?? []).forEach((ev) => {
      if (ev.id_servicio != null) evalPorServicio[ev.id_servicio] = ev
    })

    // Arma el modelo que consume ServiceCard: solo los servicios de mis
    // contratos, con su estado normalizado y la evaluacion existente (si hay)
    const misServicios = (agenda ?? [])
      .filter((s) => misContratos.includes(s.id_contrato))
      .map((s) => {
        const ev = evalPorServicio[s.id_servicio]
        return {
          id: s.id_servicio,
          nombre: `Servicio de Aseo #${s.id_servicio}`,
          fecha: formatearFecha(s.fecha_programada),
          estado: ESTADOS_EVALUABLES.includes(s.estado) ? 'finalizado' : 'en_proceso',
          estadoLabel: s.estado,
          calificacion: ev?.nota ?? null,
          comentario: ev?.comentarios ?? '',
          id_evaluacion: ev?.id_evaluacion ?? null,
        }
      })

    setServicios(misServicios)
  }, [usuario.id_usuario])

  const { cargando, error: errorCarga, recargar: cargar } = useCarga(cargarDatos)
  const error = errorCarga ?? errorAccion

  // Guarda la nota del cliente: PATCH si el servicio ya tiene evaluacion
  // (editar), POST si es la primera vez (el backend valida titularidad y estado)
  const handleEvaluate = async (idServicio, { calificacion, comentario }) => {
    const servicio = servicios.find((s) => s.id === idServicio)
    try {
      if (servicio?.id_evaluacion) {
        await api.patch(`/evaluacionFinal/${servicio.id_evaluacion}`, {
          nota: calificacion,
          comentarios: comentario || undefined,
        })
      } else {
        await api.post('/evaluacionFinal', {
          nota: calificacion,
          comentarios: comentario || undefined,
          id_servicio: idServicio,
        })
      }
      setErrorAccion(null)
      cargar()
    } catch (err) {
      setErrorAccion(err.errors?.length ? err.errors.join(' · ') : err.message)
    }
  }

  // Elimina la evaluacion propia, con confirmacion previa
  const handleDelete = async (idServicio) => {
    const servicio = servicios.find((s) => s.id === idServicio)
    if (!servicio?.id_evaluacion) return
    if (!window.confirm('¿Seguro que quieres eliminar tu evaluación?')) return
    try {
      await api.delete(`/evaluacionFinal/${servicio.id_evaluacion}`)
      setErrorAccion(null)
      cargar()
    } catch (err) {
      setErrorAccion(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-black">Mis Servicios Contratados</h1>
        </header>

        {error && (
          <p className="mb-6 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando servicios...</p>
        ) : sinCliente ? (
          <p className="text-sm text-gray-500">
            Tu usuario no está vinculado a ningún cliente. Contacta al administrador.
          </p>
        ) : servicios.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no tienes servicios contratados.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {servicios.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEvaluate={handleEvaluate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
