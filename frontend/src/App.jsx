import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { rutaInicioPorRol } from './services/authService'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/DashboardAdministrativo'
import MisTareas from './pages/MisTareas'
import Usuarios from './pages/Usuarios'
import Roles from './pages/Roles'
import Clientes from './pages/Clientes'
import Contratos from './pages/Contratos'
import AgendaServicios from './pages/AgendaServicios'
import Trabajadores from './pages/Trabajadores'
import AsignarServicios from './pages/AsignarServicios'
import Insumos from './pages/Insumos'
import Reportes from './pages/Reportes'
import HistorialEvaluaciones from './pages/HistorialEvaluaciones'
import Asistencia from './pages/Asistencia'
import Perfil from './pages/Perfil'

// Manda a cada rol a su pagina de inicio.
function InicioSegunRol() {
  const { estaAutenticado, rol } = useAuth()
  if (!estaAutenticado) return <Navigate to="/login" replace />
  return <Navigate to={rutaInicioPorRol(rol)} replace />
}

function NoAutorizado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4">
      <h1 className="text-2xl font-bold text-black">No tienes permiso para ver esta sección</h1>
      <p className="text-sm text-gray-500">Tu rol no tiene acceso a esta sección.</p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Ir al inicio
      </Link>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Publicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Rutas Privadas (requieren sesion; envueltas en el Layout del Sidebar) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<InicioSegunRol />} />

              {/* Solo Admin y Coordinador */}
              <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'Coordinador']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/contratos" element={<Contratos />} />
                <Route path="/trabajadores" element={<Trabajadores />} />
                <Route path="/asignar-servicios" element={<AsignarServicios />} />
                <Route path="/reportes" element={<Reportes />} />
              </Route>

              {/* Solo Admin */}
              <Route element={<ProtectedRoute rolesPermitidos={['Administrador']} />}>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/rol" element={<Roles />} />
              </Route>

              {/* Admin, Coordinador y Supervisor */}
              <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'Coordinador', 'Supervisor']} />}>
                <Route path="/agenda" element={<AgendaServicios />} />
              </Route>

              {/* Cualquier usuario autenticado (principalmente Trabajador) */}
              <Route path="/mis-tareas" element={<MisTareas />} />

              {/* Perfil propio: cualquier usuario autenticado */}
              <Route path="/perfil" element={<Perfil />} />

              {/* Reloj control (Trabajador) y gestion de inasistencias (Supervisor+) */}
              <Route element={<ProtectedRoute rolesPermitidos={['Trabajador', 'Supervisor', 'Coordinador', 'Administrador']} />}>
                <Route path="/asistencia" element={<Asistencia />} />
              </Route>

              {/* Cliente: evaluacion de sus servicios (el backend solo permite crear al rol Cliente) */}
              <Route element={<ProtectedRoute rolesPermitidos={['Cliente']} />}>
                <Route path="/mis-servicios" element={<HistorialEvaluaciones />} />
              </Route>

              {/* Admin y Gestor de Inventario */}
              <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'GestorInventario']} />}>
                <Route path="/insumos" element={<Insumos />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
