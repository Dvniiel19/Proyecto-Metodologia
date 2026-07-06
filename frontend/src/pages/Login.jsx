import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { rutaInicioPorRol } from '../services/authService'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const usuario = await login(correo, contrasena)
      navigate(rutaInicioPorRol(usuario.nombre_rol), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border-2 border-black bg-white p-8">
          <h1 className="text-2xl font-bold text-black">Aseo Gestión</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="block text-sm font-medium text-black">
              Correo
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
                className="mt-1 w-full rounded-md border border-gray-400 p-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
              />
            </label>

            <label className="block text-sm font-medium text-black">
              Contraseña
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-400 p-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
              />
            </label>

            {error && (
              <p className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-md bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-black underline">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}