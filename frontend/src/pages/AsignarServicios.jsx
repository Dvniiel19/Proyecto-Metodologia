import CrudPage from '../components/CrudPage'
import { useAuth } from '../context/AuthContext'

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
        { key: 'estado', label: 'Estado' },
      ]}
      campos={[
        { key: 'fecha_asignada', label: 'Fecha Asignada', type: 'date', required: true },
        {
          key: 'id_servicio',
          label: 'Servicio (Agenda)',
          type: 'select',
          required: true,
          opcionesEndpoint: '/agenda',
          opcionValor: 'id_servicio',
          opcionEtiqueta: (s) =>
            #${s.id_servicio} — ${s.fecha_programada} (${s.estado}),
        },
        {
          key: 'id_trabajador',
          label: 'Trabajador',
          type: 'select',
          required: true,
          opcionesEndpoint: '/trabajador',
          opcionValor: 'id_trabajador',
          opcionEtiqueta: (t) => ${t.nombre} ${t.apellido},
        },
      ]}
    />
  )
}