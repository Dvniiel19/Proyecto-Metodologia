// Contexto global de autenticacion: guarda el usuario logueado y su rol,
// y expone login/logout a toda la app. Cualquier componente puede leerlo con useAuth().
import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Estado inicial perezoso: recupera la sesion guardada en localStorage
  // (si el token no expiro), asi el usuario no pierde la sesion al refrescar la pagina
  const [usuario, setUsuario] = useState(() => authService.obtenerSesion())

  // Llama al backend, guarda el token y actualiza el estado global
  const login = async (correo, contrasena) => {
    const user = await authService.login(correo, contrasena)
    setUsuario(user)
    return user
  }

  // Borra el token de localStorage y limpia el estado (las rutas protegidas rediriguen al login)
  const logout = () => {
    authService.logout()
    setUsuario(null)
  }

  // Valores derivados que consumen ProtectedRoute y el Layout para decidir que mostrar
  const value = {
    usuario,
    rol: usuario?.nombre_rol ?? null,
    estado_rol: usuario?.estado_rol ?? null,
    estaAutenticado: usuario != null,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}