// Pagina de Trabajadores: CRUD del personal de aseo. La creacion se hace con
// PersonalForm (crea cuenta + perfil de trabajador juntos) y la tabla muestra
// el promedio de satisfaccion que calcula el backend desde las evaluaciones.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import CrudPage from '../components/CrudPage'
import PersonalForm from '../components/PersonalForm'

export default function Trabajadores() {
  const [formVisible, setFormVisible] = useState(false)
  // Incrementar la version fuerza al CrudPage a recargar tras crear un trabajador
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
            <Plus className="h-4 w-4" />
            Crear Nuevo Trabajador
          </button>
        </div>

        {formVisible && (
          <PersonalForm
            rolesDisponibles={['Trabajador']}
            onClose={() => setFormVisible(false)}
            onCreado={() => {
              setFormVisible(false)
              setVersion((v) => v + 1)
            }}
          />
        )}
      </div>

      <div className="-mt-8">
        <CrudPage
          key={version}
          titulo="Trabajadores"
          endpoint="/trabajador"
          idKey="id_trabajador"
          rolesEscritura={['Administrador', 'Coordinador']}
          ocultarCrear
          columnas={[
            { key: 'id_trabajador', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellido', label: 'Apellido' },
            { key: 'telefono', label: 'Teléfono' },
            {
              key: 'promedio_satisfaccion',
              label: 'Promedio Satisfacción',
              render: (fila) =>
                fila.promedio_satisfaccion != null ? (
                  <span className="font-semibold text-black">
                    ★ {Number(fila.promedio_satisfaccion).toFixed(1)} / 5
                  </span>
                ) : (
                  <span className="text-gray-400">Sin evaluaciones</span>
                ),
            },
          ]}
          campos={[
            { key: 'nombre', label: 'Nombre', type: 'text', required: true },
            { key: 'apellido', label: 'Apellido', type: 'text', required: true },
            { key: 'telefono', label: 'Teléfono', type: 'text', required: true },
          ]}
        />
      </div>
    </div>
  )
}
