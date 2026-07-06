import { useEffect, useState, useCallback } from 'react'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'


export default function CrudPage({ titulo, endpoint, idKey, columnas, campos, rolesEscritura, valoresFijos, ocultarCrear = false }) {
  const { rol } = useAuth()
  const puedeEscribir = rolesEscritura == null || rolesEscritura.includes(rol)

  const [filas, setFilas] = useState([])
  const [opciones, setOpciones] = useState({}) // key de campo -> lista de opciones
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [formVisible, setFormVisible] = useState(false)
  const [editando, setEditando] = useState(null) // fila en edicion o null (creando)
  const [valores, setValores] = useState({})
  const [erroresForm, setErroresForm] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      const data = await api.get(endpoint)
      setFilas(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [endpoint])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar()
  }, [cargar])

  // Carga las opciones de los selects que vienen de otros endpoints
  useEffect(() => {
    campos
      .filter((c) => c.type === 'select' && c.opcionesEndpoint)
      .forEach((campo) => {
        api
          .get(campo.opcionesEndpoint)
          .then((data) =>
            setOpciones((prev) => ({ ...prev, [campo.key]: Array.isArray(data) ? data : [] })),
          )
          .catch(() => {})
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  const abrirCrear = () => {
    setEditando(null)
    setValores({})
    setErroresForm(null)
    setFormVisible(true)
  }

  const abrirEditar = (fila) => {
    setEditando(fila)
    const iniciales = {}
    campos.forEach((c) => {
      if (c.type === 'password') return
      if (fila[c.key] != null) iniciales[c.key] = String(fila[c.key])
    })
    setValores(iniciales)
    setErroresForm(null)
    setFormVisible(true)
  }

  const cerrarForm = () => {
    setFormVisible(false)
    setEditando(null)
    setErroresForm(null)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setErroresForm(null)
    setGuardando(true)

    const body = { ...valoresFijos }
    campos.forEach((c) => {
      if (editando && c.soloCrear) return
      const v = valores[c.key]
      if (v == null || v === '') return
      body[c.key] = c.type === 'number' || c.type === 'select' ? Number(v) || v : v
    })

    try {
      if (editando) {
        await api.patch(`${endpoint}/${editando[idKey]}`, body)
      } else {
        await api.post(endpoint, body)
      }
      cerrarForm()
      cargar()
    } catch (err) {
      setErroresForm(err.errors?.length ? err.errors : [err.message])
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (fila) => {
    if (!window.confirm('¿Seguro que quieres eliminar este registro?')) return
    try {
      await api.delete(`${endpoint}/${fila[idKey]}`)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const renderInput = (campo) => {
    const comun = {
      value: valores[campo.key] ?? '',
      onChange: (e) => setValores((prev) => ({ ...prev, [campo.key]: e.target.value })),
      required: campo.required && !editando,
      className:
        'mt-1 w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:border-black focus:outline-none',
    }

    if (campo.type === 'select') {
      const lista = campo.opciones ?? opciones[campo.key] ?? []
      return (
        <select {...comun}>
          <option value="">Seleccionar...</option>
          {lista.map((op) => {
            const valor = campo.opcionValor ? op[campo.opcionValor] : op.value ?? op
            const etiqueta = campo.opcionEtiqueta ? campo.opcionEtiqueta(op) : op.label ?? String(op)
            return (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            )
          })}
        </select>
      )
    }

    return <input type={campo.type ?? 'text'} {...comun} />
  }

  return (
    <div className="px-8 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-black">{titulo}</h1>
        {puedeEscribir && !ocultarCrear && (
          <button
            type="button"
            onClick={abrirCrear}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Crear Nuevo
          </button>
        )}
      </header>

      {error && (
        <p className="mb-4 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {formVisible && (
        <div className="mb-6 rounded-lg border-2 border-black bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">
              {editando ? 'Editar registro' : 'Nuevo registro'}
            </h2>
            <button
              type="button"
              onClick={cerrarForm}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleGuardar}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {campos
                .filter((c) => !(editando && c.soloCrear))
                .map((campo) => (
                  <label key={campo.key} className="block text-sm font-medium text-black">
                    {campo.label}
                    {renderInput(campo)}
                  </label>
                ))}
            </div>

            {erroresForm && (
              <ul className="mt-4 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
                {erroresForm.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={cerrarForm}
                className="rounded-md border border-gray-400 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              {columnas.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-black">
                  {col.label}
                </th>
              ))}
              {puedeEscribir && <th className="px-4 py-3 font-semibold text-black">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cargando ? (
              <tr>
                <td colSpan={columnas.length + 1} className="px-4 py-6 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : filas.length === 0 ? (
              <tr>
                <td colSpan={columnas.length + 1} className="px-4 py-6 text-center text-gray-500">
                  No hay registros.
                </td>
              </tr>
            ) : (
              filas.map((fila) => (
                <tr key={fila[idKey]}>
                  {columnas.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(fila) : String(fila[col.key] ?? '—')}
                    </td>
                  ))}
                  {puedeEscribir && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          title="Editar"
                          onClick={() => abrirEditar(fila)}
                          className="flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                        <button
                          type="button"
                          title="Eliminar"
                          onClick={() => handleEliminar(fila)}
                          className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
