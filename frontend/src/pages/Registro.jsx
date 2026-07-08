import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'
import { rutaInicioPorRol } from '../services/authService'
import { inputClase } from '../helpers/estilos'
import { Eye, EyeOff } from 'lucide-react' // 1. Importamos los iconos

export default function Registro() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [rolCliente, setRolCliente] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: '',
    contrasena: '',
  })
  const [errores, setErrores] = useState(null)
  const [cargando, setCargando] = useState(false)
  
  //  2. Agregamos el estado para controlar el ojito
  const [showPassword, setShowPassword] = useState(false) 

  useEffect(() => {
    api
      .get('/auth/roles-registrables')
      .then((roles) => setRolCliente(roles?.find((r) => r.nombre_rol === 'Cliente') ?? null))
      .catch(() => setRolCliente(null))
  }, [])

  const setCampo = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores(null)
    setCargando(true)
    try {
      await api.post('/auth/register', {
        ...form,
        id_rol: rolCliente.id_rol,
      })
      // registro exitoso: iniciamos sesion automaticamente
      const usuario = await login(form.correo, form.contrasena)
      navigate(rutaInicioPorRol(usuario.nombre_rol), { replace: true })
    } catch (err) {
      setErrores(err.errors?.length ? err.errors : [err.message])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border-2 border-black bg-white p-8">
          <h1 className="text-2xl font-bold text-black">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Regístrate como cliente para contratar y evaluar servicios de aseo
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-black">
                Nombre
                <input
                  type="text"
                  value={form.nombre}
                  onChange={setCampo('nombre')}
                  required
                  placeholder="Tu nombre"
                  className={inputClase}
                />
              </label>
              <label className="block text-sm font-medium text-black">
                Apellido
                <input
                  type="text"
                  value={form.apellido}
                  onChange={setCampo('apellido')}
                  required
                  placeholder="Tu apellido"
                  className={inputClase}
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-black">
              Teléfono
              <input
                type="tel"
                value={form.telefono}
                onChange={setCampo('telefono')}
                required
                placeholder="912345678"
                className={inputClase}
              />
            </label>

            <label className="block text-sm font-medium text-black">
              Dirección
              <input
                type="text"
                value={form.direccion}
                onChange={setCampo('direccion')}
                required
                placeholder="Dirección donde se prestará el servicio"
                className={inputClase}
              />
            </label>

            <label className="block text-sm font-medium text-black">
              Correo
              <input
                type="email"
                value={form.correo}
                onChange={setCampo('correo')}
                required
                placeholder="correo@ejemplo.com"
                className={inputClase}
              />
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-black">Contraseña</span>
              {/* 👈 3. Envolvemos el input y agregamos el botón */}
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={setCampo('contrasena')}
                  required
                  placeholder="Mín. 8: mayúscula, número y símbolo"
                  className={`${inputClase} pr-10`} // Agregamos pr-10 para que el texto no pise el icono
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errores && (
              <ul className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-600">
                {errores.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={cargando || rolCliente == null}
              className="w-full rounded-md bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-black underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}