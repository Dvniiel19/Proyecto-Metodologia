import CrudPage from '../components/CrudPage'
import { formatearFecha, fechaChileAIso } from '../utils/fechas'

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
        { key: 'hora_fin', label: 'Hora de Fin', type: 'time' },
        {
          key: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          // Ciclo de vida real del servicio (ver backend constants/estadosAgenda.js)
          opciones: [
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Personal Asignado', label: 'Personal Asignado' },
            { value: 'En Proceso', label: 'En Proceso' },
            { value: 'Pendiente de Evaluacion', label: 'Pendiente de Evaluación' },
            { value: 'Finalizado', label: 'Finalizado' },
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
            `#${c.id_contrato}${c.nombre ? ` ${c.nombre}` : ''} (${formatearFecha(c.fecha_inicio)} → ${formatearFecha(c.fecha_fin)})`,
          // Al elegir contrato se sugiere su fecha de inicio como fecha programada
          // (el contrato no define horarios; solo se rellenan campos vacíos)
          autoRellenar: (c) => ({
            fecha_programada: fechaChileAIso(String(c.fecha_inicio)),
          }),
        },
      ]}
    />
  )
}
