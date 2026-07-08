// Pagina "Gestion de Tareas" (Admin/Coordinador): crea las tareas concretas
// que el trabajador vera en "Mis Tareas". Cada tarea cuelga de una asignacion
// (servicio + trabajador) y muestra si ya tiene evidencia fotografica.
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
        {
          key: 'descripcion',
          label: 'Descripción',
          // La descripcion ahora vive en la asignacion; se conserva el valor
          // propio de la tarea como respaldo para registros antiguos
          render: (fila) => fila.asignacion_servicio?.descripcion ?? fila.descripcion ?? '—',
        },
        { key: 'estado', label: 'Estado' },
        {
          key: 'foto_evidencia',
          label: 'Evidencia',
          render: (fila) => (fila.foto_evidencia ? 'Sí' : '—'),
        },
      ]}
      campos={[
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
