import CrudPage from '../components/CrudPage'
export default function Roles() {
  return (
    <CrudPage
      titulo="Roles"
      endpoint="/rol"
      idKey="id_rol"
      rolesEscritura={['Administrador']}
      columnas={[
        { key: 'id_rol', label: 'ID' },
        { key: 'nombre_rol', label: 'Nombre del Rol' },
      ]}
      campos={[{ key: 'nombre_rol', label: 'Nombre del Rol', type: 'text', required: true }]}
      ocultarCrear={true}
    />
  )
}