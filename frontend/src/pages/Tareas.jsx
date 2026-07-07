import CrudPage from '../components/CrudPage'
import { formatearFecha } from '../utils/fechas'

export default function Tareas() {
  return (
    <CrudPage
      titulo="Tareas"
      endpoint="/tarea"
      idKey="id_tarea"
      rolesEscritura={['Administrador', 'Coordinador']}
      columnas={[
        { key: 'id_tarea', label: 'ID' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'estado', label: 'Estado' },
        {
          key: 'foto_evidencia',
          label: 'Evidencia',
          render: (fila) => (fila.foto_evidencia ? 'Sí' : '—'),
        },
      ]}
      campos={[
        {
          key: 'descripcion',
          label: 'Descripción de la tarea',
          type: 'text',
          required: true,
        },
        {
          key: 'id_asignacion',
          label: 'Asignación (Servicio + Trabajador)',
          type: 'select',
          required: true,
          opcionesEndpoint: '/asignarServicio',
          opcionValor: 'id_asignacion',
          opcionEtiqueta: (a) =>
            `#${a.id_asignacion} — Servicio ${a.id_servicio} · Trab. ${a.id_trabajador} (${formatearFecha(a.fecha_asignada)})`,
        },
      ]}
    />
  )
}
