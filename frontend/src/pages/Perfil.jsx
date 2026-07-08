import { useState } from 'react'
import { KeyRound, User } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { inputClase } from '../helpers/estilos'

export default function Perfil() {
  const { usuario, rol } = useAuth()

  const [contrasena, setContrasena] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [errores, setErrores] = useState(null)
  const [exito, setExito] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const noCoinciden = confirmacion !== '' && contrasena !== confirmacion

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores(null)
    setExito(false)

    if (contrasena !== confirmacion) {
      setErrores(['Las contraseñas no coinciden'])
      return
    }

    setGuardando(true)
    try {
      // el backend exige id_rol en la actualizacion; se envia el de la sesion
      await api.patch(`/usuario/${usuario.id_usuario}`, {
        contrasena,
        id_rol: usuario.id_rol,
      })
      setExito(true)
      setContrasena('')
      setConfirmacion('')
    } catch (err) {
      setErrores(err.errors?.length ? err.errors : [err.message])
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">Mi Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">Datos de tu cuenta y cambio de contraseña</p>
      </header>

      <div className="max-w-md">
        <div className="mb-6 rounded-lg border border-gray-300 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-black">
            <User className="h-4 w-4" />
            Cuenta
          </h2>
          <dl className="mt-3 text-sm">
            <div className="flex justify-between border-b border-gray-200 py-2">
              <dt className="text-gray-500">Correo</dt>
              <dd className="font-medium text-black">{usuario?.correo}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Rol</dt>
              <dd className="font-medium text-black">{rol}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border-2 border-black bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-black">
            <KeyRound className="h-4 w-4" />
            Cambiar Contraseña
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <label className="block text-sm font-medium text-black">
              Nueva contraseña
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="Mín 8: mayúscula, número y símbolo"
                className={inputClase}
              />
            </label>

            <label className="block text-sm font-medium text-black">
              Confirmar contraseña
              <input
                type="password"
                value={confirmacion}
                onChange={(e) => setConfirmacion(e.target.value)}
                required
                placeholder="Repite la nueva contraseña"
                className={inputClase}
              />
              {noCoinciden && (
                <span className="mt-1 block text-xs font-medium text-red-600">
                  Las contraseñas no coinciden.
                </span>
              )}
            </label>

            {errores && (
              <ul className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-600">
                {errores.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}

            {exito && (
              <p className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-black">
               
              </p>
            )}

            <button
              type="submit"
              disabled={guardando || contrasena === '' || noCoinciden}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {guardando ? 'Guardando...' : 'Guardar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
