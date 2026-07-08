import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import CrudPage from '../components/CrudPage'
import PersonalForm from '../components/PersonalForm'

export default function Usuarios() {
  const [formVisible, setFormVisible] = useState(false)
  // Incrementar la versión fuerza al CrudPage a recargar tras crear personal
  const [version, setVersion] = useState(0)

  return (
    <div>
      <div className="px-8 pt-8">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <UserPlus className="h-4 w-4" />
            Crear Personal
          </button>
        </div>

        {formVisible && (
          <PersonalForm
            rolesDisponibles={['Trabajador', 'Supervisor', 'Coordinador', 'GestorInventario']}
            onClose={() => setFormVisible(false)}
            onCreado={() => {
              setFormVisible(false)
              setVersion((v) => v + 1)
            }}
          />
        )}
      </div>

      {/* Corregido el div de apertura aquí abajo */}
      <div className="-mt-8">
        <CrudPage
          key={version}
          titulo="Usuarios"
          endpoint="/usuario"
          idKey="id_usuario"
          rolesEscritura={['Administrador']} // Corregido el formato del array
          ocultarCrear
          columnas={[
            { key: 'id_usuario', label: 'ID' },
            { key: 'correo', label: 'Correo' },
            { key: 'id_rol', label: 'Rol (ID)' },
            { 
              key: 'estado_rol', 
              label: 'Estado del Rol',
              render: (fila) => {
                if (fila.fecha_expiracion) {
                  const ahora = new Date();
                  const limite = new Date(fila.fecha_expiracion);
                  if (ahora > limite) {
                    return <span className="text-red-500 font-semibold">Rol expirado</span>;
                  }
                }
                return fila.estado_rol;
              }
            },
            { key: 'fecha_expiracion', label: 'Fecha de Expiración del Rol' }
          ]}
          campos={[
            { key: 'correo', label: 'Correo', type: 'email', required: true },
            { key: 'contrasena', label: 'Contraseña', type: 'password', required: false },
            {
              key: 'id_rol',
              label: 'Rol',
              type: 'select',
              required: true,
              opcionesEndpoint: '/rol',
              opcionValor: 'id_rol',
              opcionEtiqueta: (r) => r.nombre_rol,
            },
            {
              key: 'fecha_expiracion',
              label: 'Fecha de Expiración del Rol',
              type: 'datetime-local',
              required: false
            }
          ]}
        />
      </div>
    </div>
  )
}