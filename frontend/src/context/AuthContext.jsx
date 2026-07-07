import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.obtenerSesion())

  const login = async (correo, contrasena) => {
    const user = await authService.login(correo, contrasena)
    setUsuario(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setUsuario(null)
  }

  const value = {
    usuario,
    rol: usuario?.nombre_rol ?? null,
    estaAutenticado: usuario != null,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export function useAuth() {
  return useContext(AuthContext)
}