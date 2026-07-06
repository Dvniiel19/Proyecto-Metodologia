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
  { label: 'Tareas', icon: ListChecks, to: '/mis-tareas', roles: ['Administrador', 'Coordinador', 'Supervisor', 'Trabajador'] },
  { label: 'Asistencia', icon: Clock, to: '/asistencia', roles: ['Administrador', 'Coordinador', 'Supervisor', 'Trabajador'] },
  { label: 'Mis Servicios', icon: Star, to: '/mis-servicios', roles: ['Cliente'] },
  { label: 'Insumos', icon: Boxes, to: '/insumos', roles: ['Administrador', 'GestorInventario'] },
  { label: 'Reportes', icon: BarChart3, to: '/reportes', roles: ['Administrador', 'Coordinador'] },
]

function Sidebar() {
  const { usuario, rol, logout } = useAuth()
  const navigate = useNavigate()

  const inicial = usuario?.correo?.charAt(0).toUpperCase() ?? '?'
  const itemsVisibles = NAV_ITEMS.filter(
    (item) => item.roles == null || item.roles.includes(rol),
  )

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-300 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-black">Aseo Gestión</h2>
        <p className="text-xs text-gray-500">Panel Administrativo</p>
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
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
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

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between rounded-md border border-gray-300 p-3">
          <NavLink
            to="/perfil"
            title="Ver mi perfil"
            className="flex min-w-0 items-center gap-3 rounded-md transition-colors hover:opacity-70"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black" title={usuario?.correo}>
                {usuario?.correo}
              </p>
              <p className="truncate text-xs text-gray-500">{rol}</p>
            </div>
          </NavLink>
          <button
            type="button"
            title="Cerrar sesión"
            onClick={handleLogout}
            className="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
