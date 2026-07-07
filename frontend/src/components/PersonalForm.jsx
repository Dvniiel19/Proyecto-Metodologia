import { useEffect, useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { api } from '../services/api'
import { inputClase } from '../helpers/estilos'

const CONTRASENA_GENERICA = 'Cambiar123!'


export default function PersonalForm({ rolesDisponibles, onClose, onCreado }) {
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    contrasena: CONTRASENA_GENERICA,
    id_rol: '',
  })
  const [errores, setErrores] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    api
      .get('/rol')
      .then((data) => {
        const filtrados = (data ?? []).filter((r) => rolesDisponibles.includes(r.nombre_rol))
        setRoles(filtrados)
        // si solo hay un rol posible, se selecciona solo
        if (filtrados.length === 1) {
          setForm((prev) => ({ ...prev, id_rol: String(filtrados[0].id_rol) }))
        }
      })
      .catch(() => setRoles([]))
    // Solo se cargan los roles una vez al montar; rolesDisponibles es estable por render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setCampo = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores(null)
    setGuardando(true)
    try {
      await api.post('/usuario/personal', {
        ...form,
        id_rol: Number(form.id_rol),
      })
      onCreado()
    } catch (err) {
      setErrores(err.errors?.length ? err.errors : [err.message])
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border-2 border-black bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
          <UserPlus className="h-5 w-5" />
          Crear Personal
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-black">
            Nombre
            <input type="text" value={form.nombre} onChange={setCampo('nombre')} required className={inputClase} />
          </label>
          <label className="block text-sm font-medium text-black">
            Apellido
            <input type="text" value={form.apellido} onChange={setCampo('apellido')} required className={inputClase} />
          </label>
          <label className="block text-sm font-medium text-black">
            Teléfono
            <input type="tel" value={form.telefono} onChange={setCampo('telefono')} required className={inputClase} />
          </label>

          {roles.length > 1 && (
            <label className="block text-sm font-medium text-black">
              Rol
              <select value={form.id_rol} onChange={setCampo('id_rol')} required className={inputClase}>
                <option value="">Seleccionar...</option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre_rol}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block text-sm font-medium text-black">
            Correo (para iniciar sesión)
            <input type="email" value={form.correo} onChange={setCampo('correo')} required className={inputClase} />
          </label>
          <label className="block text-sm font-medium text-black">
            Contraseña inicial
            <input type="text" value={form.contrasena} onChange={setCampo('contrasena')} required className={inputClase} />
            <span className="mt-1 block text-xs text-gray-500">
              Se sugiere una genérica: la persona podrá cambiarla desde su perfil.
            </span>
          </label>
        </div>

        {errores && (
          <ul className="mt-4 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
            {errores.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={guardando || form.id_rol === ''}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {guardando ? 'Creando...' : 'Crear Cuenta y Perfil'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-400 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
