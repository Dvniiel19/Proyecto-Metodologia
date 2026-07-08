// Pagina "Asignar Servicios": cumple el requisito de asignacion de operarios.
// Vincula un trabajador a una jornada de la agenda con la descripcion de su
// tarea; el backend valida disponibilidad y cruces de horario al guardar.
import CrudPage from '../components/CrudPage'
import { useAuth } from '../context/AuthContext'
import { formatearFecha, fechaChileAIso } from '../utils/fechas'

export default function AsignarServicios() {
  const { usuario } = useAuth()

  return (
    <CrudPage
      titulo="Asignar Servicios"
      endpoint="/asignarServicio"
      idKey="id_asignacion"
      rolesEscritura={['Administrador', 'Coordinador']}
      // El backend exige id_usuario (quién asigna); usamos el de la sesión actual
      valoresFijos={{ id_usuario: usuario?.id_usuario }}
      columnas={[
        { key: 'id_asignacion', label: 'ID' },
        { key: 'fecha_asignada', label: 'Fecha Asignada' },
        { key: 'id_servicio', label: 'Servicio (ID)' },
        { key: 'id_trabajador', label: 'Trabajador (ID)' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'estado', label: 'Estado' },
      ]}
      campos={[
        {
          key: 'id_trabajador',
          label: 'Trabajador',
          type: 'select',
          required: true,
          opcionesEndpoint: '/trabajador',
          opcionValor: 'id_trabajador',
          opcionEtiqueta: (t) => `${t.nombre} ${t.apellido}`,
        },
        {
          key: 'id_servicio',
          label: 'Servicio (Agenda)',
          type: 'select',
          required: true,
          opcionesEndpoint: '/agenda',
          opcionValor: 'id_servicio',
          opcionEtiqueta: (s) =>
            `#${s.id_servicio} — ${formatearFecha(s.fecha_programada)} (${s.estado})`,
          // Al elegir la jornada se sugiere su fecha programada como fecha asignada
          // (solo rellena si el campo esta vacio; sigue siendo editable)
          autoRellenar: (s) => ({
            fecha_asignada: fechaChileAIso(String(s.fecha_programada)),
          }),
        },
        {
          key: 'descripcion',
          label: 'Descripción de la tarea',
          type: 'text',
          required: true,
        },
        { 
          key: 'fecha_asignada', 
          label: 'Fecha Asignada', 
          type: 'date', 
          required: true 
        },
      ]}
    />
  )
}
