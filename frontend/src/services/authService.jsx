import { api } from './api'

// Decodifica el payload del JWT (sin verificar firma; eso lo hace el backend)
export function decodificarToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

// Página de inicio según el rol del usuario
export function rutaInicioPorRol(rol) {
  if (rol === 'Administrador'  rol === 'Coordinador') return '/dashboard'
  if (rol === 'Supervisor') return '/agenda'
  if (rol === 'GestorInventario') return '/insumos'
  if (rol === 'Cliente') return '/mis-servicios'
  return '/mis-tareas'
}

export async function login(correo, contrasena) {
  const data = await api.post('/auth/login', { correo, contrasena })
  const payload = decodificarToken(data.token)

  const usuario = {
    ...data.usuario,
    nombre_rol: payload?.nombre_rol ?? null,
  }

  localStorage.setItem('token', data.token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
  return usuario
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function obtenerSesion() {
  const token = localStorage.getItem('token')
  const usuarioRaw = localStorage.getItem('usuario')
  if (!token  !usuarioRaw) return null

  const payload = decodificarToken(token)
  // Token vencido: limpiamos la sesión
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    logout()
    return null
  }

  try {
    return JSON.parse(usuarioRaw)
  } catch {
    logout()
    return null
  }
}
