import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  CalendarDays,
  ListChecks,
  Boxes,
  BarChart3,
  LogOut,
  UserCheck,
  Star,
  Clock,
  Sun,  // <-- Añadido
  Moon, // <-- Añadido
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', roles: ['Administrador', 'Coordinador'] },
  { label: 'Usuarios', icon: Users, to: '/usuarios', roles: ['Administrador'] },
  { label: 'Rol', icon: ShieldCheck, to: '/rol', roles: ['Administrador'] },
  { label: 'Clientes', icon: Building2, to: '/clientes', roles: ['Administrador', 'Coordinador'] },
  { label: 'Contratos', icon: FileText, to: '/contratos', roles: ['Administrador', 'Coordinador'] },
  { label: 'Agenda de Servicios', icon: CalendarDays, to: '/agenda', roles: ['Administrador', 'Coordinador', 'Supervisor'] },
  { label: 'Trabajadores', icon: Users, to: '/trabajadores', roles: ['Administrador', 'Coordinador'] },
  { label: 'Asignar Servicios', icon: UserCheck, to: '/asignar-servicios', roles: ['Administrador', 'Coordinador'] },
  { label: 'Gestión de Tareas', icon: ListChecks, to: '/tareas', roles: ['Administrador', 'Coordinador'] },
  { label: 'Tareas', icon: ListChecks, to: '/mis-tareas', roles: ['Administrador', 'Coordinador', 'Supervisor', 'Trabajador'] },
  { label: 'Asistencia', icon: Clock, to: '/asistencia', roles: ['Administrador', 'Coordinador', 'Supervisor', 'Trabajador'] },
  { label: 'Mis Servicios', icon: Star, to: '/mis-servicios', roles: ['Cliente'] },
  { label: 'Insumos', icon: Boxes, to: '/insumos', roles: ['Administrador', 'GestorInventario'] },
  { label: 'Reportes', icon: BarChart3, to: '/reportes', roles: ['Administrador', 'Coordinador'] },
]

function Sidebar() {
  const { usuario, rol, logout } = useAuth()
  const navigate = useNavigate()

  // --- LÓGICA MODO OSCURO ---
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])
  // ---------------------------

  const inicial = usuario?.correo?.charAt(0).toUpperCase() ?? '?'
  const itemsVisibles = NAV_ITEMS.filter(
    (item) => item.roles == null || item.roles.includes(rol),
  )

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    // Se agregan clases dark:border-gray-800 dark:bg-gray-900 para oscurecer la barra lateral
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-900 transition-colors duration-200">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <h2 className="text-lg font-bold text-black dark:text-white">Aseo Gestión</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Panel Administrativo</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {itemsVisibles.map(({ label, icon: Icon, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
  ? 'bg-black text-white dark:bg-gray-800 dark:text-white' /* <-- Ahora el botón activo será gris oscuro */
  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between rounded-md border border-gray-300 p-3 dark:border-gray-700">
          <NavLink
            to="/perfil"
            title="Ver mi perfil"
            className="flex min-w-0 items-center gap-3 rounded-md transition-colors hover:opacity-70"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black dark:text-white" title={usuario?.correo}>
                {usuario?.correo}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{rol}</p>
            </div>
          </NavLink>

          <div className="flex items-center gap-1">
            {/* NUEVO BOTÓN DE MODO OSCURO */}
            <button
              type="button"
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              onClick={() => setDarkMode(!darkMode)}
              className="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              title="Cerrar sesión"
              onClick={handleLogout}
              className="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  return (
    // Agregamos dark:bg-gray-950 para que el fondo de toda la pantalla derecha cambie a ultra oscuro
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Sidebar />
      <main className="admin-panel-bg min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
