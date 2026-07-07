import CrudPage from '../components/CrudPage'
import { formatearFecha } from '../utils/fechas'

export default function AgendaServicios() {
  return (
    <CrudPage
      titulo="Agenda de Servicios"
      endpoint="/agenda"
      idKey="id_servicio"
      rolesEscritura={['Administrador', 'Coordinador']}
      columnas={[
        { key: 'id_servicio', label: 'ID' },
        { key: 'fecha_programada', label: 'Fecha Programada' },
        { key: 'hora_inicio', label: 'Hora Inicio' },
        { key: 'hora_fin', label: 'Hora Fin' },
        { key: 'estado', label: 'Estado' },
        { key: 'id_contrato', label: 'Contrato (ID)' },
      ]}
      campos={[
        { key: 'fecha_programada', label: 'Fecha Programada', type: 'date', required: true },
        { key: 'hora_inicio', label: 'Hora de Inicio', type: 'time', required: true },
        { key: 'hora_fin', label: 'Hora de Fin (opcional)', type: 'time' },
        {
          key: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          opciones: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'En Proceso', label: 'En Proceso' },
            { value: 'Completado', label: 'Completado' },
            { value: 'Cancelado', label: 'Cancelado' },
          ],
        },
        {
          key: 'id_contrato',
          label: 'Contrato',
          type: 'select',
          required: true,
          opcionesEndpoint: '/contrato',
          opcionValor: 'id_contrato',
          opcionEtiqueta: (c) =>
            `#${c.id_contrato} (${formatearFecha(c.fecha_inicio)} → ${formatearFecha(c.fecha_fin)})`,
        },
      ]}
    />
  )
}