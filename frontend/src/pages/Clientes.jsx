import CrudPage from '../components/CrudPage'

export default function Clientes() {
  return (
    <CrudPage
      titulo="Clientes"
      endpoint="/cliente"
      idKey="id_cliente"
      rolesEscritura={['Administrador', 'Coordinador']}
      columnas={[
        { key: 'id_cliente', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'direccion', label: 'Dirección' },
      ]}
      campos={[
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'apellido', label: 'Apellido', type: 'text', required: true },
        { key: 'telefono', label: 'Teléfono', type: 'text', required: true },
        { key: 'direccion', label: 'Dirección', type: 'text', required: true },
        { key: 'historial_servicios', label: 'Historial de Servicios (opcional)', type: 'text', required: false },
      ]}
    />
  )
}
