import { useCallback, useState } from 'react'
import { Clock, LogIn, LogOut, UserX } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useCarga from '../hooks/useCarga'
import { fechaHoyISO } from '../helpers/fechas'
import { inputClase } from '../helpers/estilos'

const ROLES_GESTOR = ['Administrador', 'Coordinador', 'Supervisor']

/** Reloj control del trabajador logueado: fichar entrada y salida */
function RelojControl({ miTrabajador, agenda, asistencias, onCambio }) {
  const [idServicio, setIdServicio] = useState('')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const misAsistencias = asistencias.filter(
    (a) => a.id_trabajador === miTrabajador.id_trabajador,
  )
  // Entrada abierta = ficha entrada y aun no ficha salida
  const entradaAbierta = misAsistencias.find(
    (a) => a.hora_entrada != null && a.hora_salida == null,
  )

  const ficharEntrada = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      await api.post('/asistencia/entrada', {
        id_trabajador: miTrabajador.id_trabajador,
        id_servicio: Number(idServicio),
      })
      setIdServicio('')
      onCambio()
    } catch (err) {
      setError(err.errors?.length ? err.errors.join(' · ') : err.message)
    } finally {
      setGuardando(false)
    }
  }

  const ficharSalida = async () => {
    setError(null)
    setGuardando(true)
    try {
      await api.patch(`/asistencia/${entradaAbierta.id_asistencia}/salida`)
      onCambio()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border-2 border-black bg-white p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
        <Clock className="h-5 w-5" />
        Reloj Control — {miTrabajador.nombre} {miTrabajador.apellido}
      </h2>

      {entradaAbierta ? (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            Tienes una jornada abierta en el servicio{' '}
            <span className="font-medium text-black">#{entradaAbierta.id_servicio}</span>{' '}
            (entrada: {entradaAbierta.hora_entrada}). Al fichar la salida, el servicio pasará
            a <span className="font-medium text-black">Finalizado</span>.
          </p>
          <button
            type="button"
            disabled={guardando}
            onClick={ficharSalida}
            className="mt-3 flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            <LogOut className="h-4 w-4" />
            {guardando ? 'Registrando...' : 'Fichar Salida'}
          </button>
        </div>
      ) : (
        <form onSubmit={ficharEntrada} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block flex-1 text-sm font-medium text-black">
            Servicio de la jornada
            <select
              value={idServicio}
              onChange={(e) => setIdServicio(e.target.value)}
              required
              className={inputClase}
            >
              <option value="">Seleccionar...</option>
              {agenda.map((s) => (
                <option key={s.id_servicio} value={s.id_servicio}>
                  #{s.id_servicio} — {String(s.fecha_programada).slice(0, 10)} ({s.estado})
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={guardando || idServicio === ''}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            <LogIn className="h-4 w-4" />
            {guardando ? 'Registrando...' : 'Fichar Entrada'}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

/** Formulario de inasistencia manual (Supervisor / Coordinador / Admin) */
function FormInasistencia({ trabajadores, agenda, onCambio }) {
  const [idTrabajador, setIdTrabajador] = useState('')
  const [idServicio, setIdServicio] = useState('')
  const [fecha, setFecha] = useState(fechaHoyISO())
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      await api.post('/asistencia/inasistencia', {
        id_trabajador: Number(idTrabajador),
        id_servicio: Number(idServicio),
        fecha,
      })
      setIdTrabajador('')
      setIdServicio('')
      onCambio()
    } catch (err) {
      setError(err.errors?.length ? err.errors.join(' · ') : err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-300 bg-white p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
        <UserX className="h-5 w-5" />
        Registrar Inasistencia
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-black">
          Trabajador
          <select
            value={idTrabajador}
            onChange={(e) => setIdTrabajador(e.target.value)}
            required
            className={inputClase}
          >
            <option value="">Seleccionar...</option>
            {trabajadores.map((t) => (
              <option key={t.id_trabajador} value={t.id_trabajador}>
                {t.nombre} {t.apellido}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-black">
          Servicio
          <select
            value={idServicio}
            onChange={(e) => setIdServicio(e.target.value)}
            required
            className={inputClase}
          >
            <option value="">Seleccionar...</option>
            {agenda.map((s) => (
              <option key={s.id_servicio} value={s.id_servicio}>
                #{s.id_servicio} — {String(s.fecha_programada).slice(0, 10)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-black">
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className={inputClase}
          />
        </label>

        <div className="sm:col-span-3">
          {error && (
            <p className="mb-3 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={guardando || !idTrabajador || !idServicio}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            {guardando ? 'Registrando...' : 'Registrar Ausencia'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Asistencia() {
  const { usuario, rol } = useAuth()
  const esGestor = ROLES_GESTOR.includes(rol)

  const [asistencias, setAsistencias] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [agenda, setAgenda] = useState([])

  const cargarDatos = useCallback(async () => {
    const [asis, trab, ag] = await Promise.all([
      api.get('/asistencia'),
      api.get('/trabajador'),
      api.get('/agenda'),
    ])
    setAsistencias(Array.isArray(asis) ? asis : [])
    setTrabajadores(Array.isArray(trab) ? trab : [])
    setAgenda(Array.isArray(ag) ? ag : [])
  }, [])

  const { cargando, error, recargar: cargar } = useCarga(cargarDatos)

  // Trabajador vinculado al usuario logueado (para el reloj control)
  const miTrabajador = trabajadores.find((t) => t.id_usuario === usuario.id_usuario)
  const nombreTrabajador = (id) => {
    const t = trabajadores.find((x) => x.id_trabajador === id)
    return t ? `${t.nombre} ${t.apellido}` : `#${id}`
  }

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">Asistencia</h1>
        <p className="mt-1 text-sm text-gray-500">Reloj control y registro de ausencias</p>
      </header>

      {error && (
        <p className="mb-4 rounded-md border border-red-300 bg-white px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : (
        <>
          {miTrabajador && (
            <RelojControl
              miTrabajador={miTrabajador}
              agenda={agenda}
              asistencias={asistencias}
              onCambio={cargar}
            />
          )}

          {!miTrabajador && !esGestor && (
            <p className="mb-6 text-sm text-gray-500">
              Tu usuario no está vinculado a ningún trabajador. Contacta al administrador.
            </p>
          )}

          {esGestor && (
            <FormInasistencia trabajadores={trabajadores} agenda={agenda} onCambio={cargar} />
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-3 font-semibold text-black">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-black">Trabajador</th>
                  <th className="px-4 py-3 font-semibold text-black">Servicio</th>
                  <th className="px-4 py-3 font-semibold text-black">Entrada</th>
                  <th className="px-4 py-3 font-semibold text-black">Salida</th>
                  <th className="px-4 py-3 font-semibold text-black">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {asistencias.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No hay registros de asistencia.
                    </td>
                  </tr>
                ) : (
                  asistencias
                    .filter((a) => esGestor || a.id_trabajador === miTrabajador?.id_trabajador)
                    .map((a) => (
                      <tr key={a.id_asistencia}>
                        <td className="px-4 py-3 text-gray-700">
                          {String(a.fecha).slice(0, 10)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {nombreTrabajador(a.id_trabajador)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">#{a.id_servicio}</td>
                        <td className="px-4 py-3 text-gray-700">{a.hora_entrada ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{a.hora_salida ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              a.estado_asistencia === 'Ausente'
                                ? 'font-semibold text-red-600'
                                : 'text-gray-700'
                            }
                          >
                            {a.estado_asistencia ?? 'Presente'}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
