import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Este componente envuelve tus rutas y pregunta: "¿El rol de este usuario está permitido aquí?"
const ProtectedRoute = ({ rolesPermitidos }) => {
  const { estaAutenticado, rol } = useAuth()

  // Sin sesión activa: al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario no tiene un rol válido para esta ruta, lo pateamos al inicio
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  // Si pasa la prueba, renderiza la vista que solicitó
  return <Outlet />
}

export default ProtectedRoute