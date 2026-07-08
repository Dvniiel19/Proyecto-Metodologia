// Pagina de Contratos: CRUD de los contratos de servicio. El contrato une al
// cliente con los servicios agendados y es la base de la validacion de
// titularidad (solo el titular puede evaluar/validar sus servicios).
import CrudPage from '../components/CrudPage'

export default function Contratos() {
  return (
    <CrudPage
      titulo="Contratos"
      endpoint="/contrato"
      idKey="id_contrato"
      rolesEscritura={['Administrador', 'Coordinador', 'Supervisor']} // Solo estos roles pueden crear, editar o eliminar contratos
      columnas={[
        { key: 'id_contrato', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha_inicio', label: 'Fecha Inicio' },
        { key: 'fecha_fin', label: 'Fecha Fin' },
        { key: 'precio', label: 'Precio' },
        { key: 'nombre_cliente', label: 'Cliente' },
      ]}
      campos={[
        { key: 'nombre', label: 'Nombre del Contrato', type: 'text', required: true },
        { key: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date', required: true },
        { key: 'fecha_fin', label: 'Fecha de Fin', type: 'date', required: true },
        { key: 'precio', label: 'Precio', type: 'number', required: true },

        
        {
          key: 'id_cliente',
          label: 'Cliente',
          type: 'select',
          required: true,
          opcionesEndpoint: '/cliente',
          opcionValor: 'id_cliente',
          opcionEtiqueta: (c) => `${c.nombre} ${c.apellido}`,
        },
      ]}
    />
  )
}
