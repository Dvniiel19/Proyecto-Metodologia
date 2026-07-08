import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { rutaInicioPorRol } from '../services/authService'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react' // 👈 Importamos la Luna y el Sol

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [showPassword, setShowPassword] = useState(false) 
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  // --- NUEVO: LÓGICA DEL MODO OSCURO ---
  const [isDark, setIsDark] = useState(false)

  // Al cargar la pantalla, revisamos si el modo oscuro ya estaba activado en el navegador
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])
  // Función para alternar el tema al presionar el botón
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }

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
    // Se agregó 'relative' y dark:bg-gray-950 para el fondo asfalto
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 transition-colors duration-200 dark:bg-gray-950">
      
      {/* NUEVO: BOTÓN FLOTANTE DEL MODO OSCURO EN LA ESQUINA */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        title="Alternar tema"
      >
        {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      <div className="w-full max-w-sm">
        {/* Recuadro de login oscurecido */}
        <div className="rounded-xl border-2 border-black bg-white p-8 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-black dark:text-white">Aseo Gestión</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Correo
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
                className="mt-1 w-full rounded-md border border-gray-400 p-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-400 transition-colors"
              />
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-black dark:text-gray-200">Contraseña</span>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-400 p-2 pr-10 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-md bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
            >
              {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-black underline dark:text-white">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}