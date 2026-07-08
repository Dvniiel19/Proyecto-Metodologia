import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowDownUp, X } from 'lucide-react'
import CrudPage from '../components/CrudPage'
import { api } from '../services/api'
import { inputClase } from '../helpers/estilos'

function AlertasInsumos({ version, onReabastecer }) {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    api
      .get('/insumos/alertas')
      .then((data) => setAlertas(Array.isArray(data) ? data : []))
      .catch(() => setAlertas([]))
  }, [version])

  if (alertas.length === 0) return null

  return (
    <div className="mb-6 flex flex-col gap-3">
      {alertas.map((insumo) => (
        <div
          key={insumo.id_insumo}
          className="rounded-lg border border-red-300 bg-white p-5 transition-colors dark:border-red-800 dark:bg-red-900/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Stock Crítico
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                El insumo{' '}
                <span className="font-medium text-black dark:text-white">
                  {insumo.nombre_insumo}
                </span>{' '}
                tiene {insumo.stock} unidades disponibles (límite de seguridad:{' '}
                {insumo.limite_seguridad ?? 10}).
              </p>

              <button
                type="button"
                onClick={() => onReabastecer(insumo)}
                className="mt-3 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
              >
                Reabastecer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MovimientoForm({ prefill, onClose, onGuardado }) {
  const [insumos, setInsumos] = useState([])
  const [agenda, setAgenda] = useState([])
  const [idInsumo, setIdInsumo] = useState(
    prefill?.id_insumo ? String(prefill.id_insumo) : ''
  )
  const [tipo, setTipo] = useState(prefill?.tipo ?? 'ingreso')
  const [cantidad, setCantidad] = useState('')
  const [idServicio, setIdServicio] = useState('')
  // const [observaciones, setObservaciones] = useState('')
  const [errores, setErrores] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    api
      .get('/insumos')
      .then((d) => setInsumos(Array.isArray(d) ? d : []))
      .catch(() => {})

    api
      .get('/agenda')
      .then((d) => setAgenda(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const insumoSeleccionado = insumos.find((i) => String(i.id_insumo) === idInsumo)
  const cantidadNum = parseInt(cantidad, 10)

  const salidaExcedeStock =
    tipo === 'salida' &&
    insumoSeleccionado != null &&
    Number.isInteger(cantidadNum) &&
    cantidadNum > insumoSeleccionado.stock

  const puedeGuardar =
    idInsumo !== '' &&
    Number.isInteger(cantidadNum) &&
    cantidadNum > 0 &&
    (tipo !== 'salida' || idServicio !== '') &&
    !salidaExcedeStock

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores(null)
    setGuardando(true)

    try {
      await api.post('/insumos/movimiento', {
        id_insumo: Number(idInsumo),
        cantidad: cantidadNum,
        tipo_movimiento: tipo,
        id_servicio: tipo === 'salida' ? Number(idServicio) : null,
        // observaciones: observaciones || undefined,
      })

      onGuardado()
    } catch (err) {
      setErrores(err.errors?.length ? err.errors : [err.message])
    } finally {
      setGuardando(false)
    }
  }

  const campoClase = `${inputClase} dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-400`

  return (
    <div className="mb-6 rounded-lg border-2 border-black bg-white p-5 transition-colors dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
          <ArrowDownUp className="h-5 w-5" />
          Registrar Movimiento de Insumo
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-black dark:text-gray-200">
            Insumo
            <select
              value={idInsumo}
              onChange={(e) => setIdInsumo(e.target.value)}
              required
              className={campoClase}
            >
              <option value="">Seleccionar...</option>
              {insumos.map((i) => (
                <option key={i.id_insumo} value={i.id_insumo}>
                  {i.nombre_insumo} (stock: {i.stock})
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-black dark:text-gray-200">
            Tipo de Movimiento
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value)

                if (e.target.value === 'ingreso') {
                  setIdServicio('')
                }
              }}
              className={campoClase}
            >
              <option value="ingreso">Ingreso</option>
              <option value="salida">Salida</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-black dark:text-gray-200">
            Cantidad
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              className={campoClase}
            />

            {salidaExcedeStock && (
              <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">
                Stock insuficiente: solo hay {insumoSeleccionado.stock} unidades disponibles.
              </span>
            )}
          </label>

          {tipo === 'salida' && (
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Servicio Asociado
              <select
                value={idServicio}
                onChange={(e) => setIdServicio(e.target.value)}
                required
                className={campoClase}
              >
                <option value="">Seleccionar...</option>

                {agenda.map((s) => (
                  <option key={s.id_servicio} value={s.id_servicio}>
                    #{s.id_servicio} — {String(s.fecha_programada).slice(0, 10)} ({s.estado})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {errores && (
          <ul className="mt-4 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {errores.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={!puedeGuardar || guardando}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
          >
            {guardando ? 'Guardando...' : 'Guardar Movimiento'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Insumos() {
  const [version, setVersion] = useState(0)
  const [movimiento, setMovimiento] = useState(null)

  const handleGuardado = () => {
    setMovimiento(null)
    setVersion((v) => v + 1)
  }

  return (
    <div className="min-h-screen text-black dark:text-white">
      <div className="px-8 pt-8">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setMovimiento({ prefill: null })}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <ArrowDownUp className="h-4 w-4" />
            Registrar Movimiento
          </button>
        </div>

        {movimiento && (
          <MovimientoForm
            prefill={movimiento.prefill}
            onClose={() => setMovimiento(null)}
            onGuardado={handleGuardado}
          />
        )}

        <AlertasInsumos
          version={version}
          onReabastecer={(insumo) =>
            setMovimiento({
              prefill: {
                id_insumo: insumo.id_insumo,
                tipo: 'ingreso',
              },
            })
          }
        />

      </div>

      <div className="-mt-8">
          <CrudPage
            key={version}
            titulo="Insumos"
            endpoint="/insumos"
            idKey="id_insumo"
            rolesEscritura={['Administrador', 'GestorInventario']}
            columnas={[
              { key: 'id_insumo', label: 'ID' },
              { key: 'nombre_insumo', label: 'Nombre' },
              { key: 'stock', label: 'Stock' },
              { key: 'limite_seguridad', label: 'Límite de Seguridad' },
              {
                key: 'estado_insumo',
                label: 'Estado',
                render: (fila) => {
                  const esCritico = Number(fila.stock) < Number(fila.limite_seguridad)
                  const estadoCalculado = esCritico ? 'Stock Critico' : 'Normal'

                  return (
                    <span
                      className={
                        esCritico
                          ? 'font-semibold text-red-600 dark:text-red-400'
                          : 'font-semibold text-gray-700 dark:text-gray-300'
                      }
                    >
                      {estadoCalculado}
                    </span>
                  )
                },
              },
            ]}
            campos={[
              {
                key: 'nombre_insumo',
                label: 'Nombre del Insumo',
                type: 'text',
                required: true,
              },
              {
                key: 'stock',
                label: 'Stock',
                type: 'number',
                required: true,
              },
              {
                key: 'limite_seguridad',
                label: 'Límite de Seguridad',
                type: 'number',
              },
            ]}
          />
      </div>
    </div>
  )
}
