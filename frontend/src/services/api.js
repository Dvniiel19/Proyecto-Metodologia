// Cliente HTTP central de la app: TODAS las llamadas al backend pasan por aqui.
// Se encarga de adjuntar el token JWT, serializar el body y manejar errores/401.
const API_URL = 'http://localhost:8001'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, { method = 'GET', body, formData } = {}) {
  // Si hay sesion, toda peticion viaja con el token en el header Authorization
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  // Con FormData (subida de fotos) NO se fija Content-Type: el navegador
  // lo arma solo con el boundary de multipart; con JSON si se declara
  if (body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
  })

  // catch(() => null): si el backend respondio sin body JSON no se rompe el flujo
  const json = await res.json().catch(() => null)

  if (res.status === 401 && getToken()) {
    // Token vencido o invalido: cerramos sesion y mandamos al login
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }

  // Errores HTTP o de negocio (success: false) se convierten en excepciones
  // con el mensaje del backend, para que cada pagina los muestre en su UI
  if (!res.ok || json?.success === false) {
    const error = new Error(json?.message || `Error ${res.status}`)
    error.status = res.status
    error.errors = json?.errors || null
    throw error
  }

  // Se devuelve solo data: las paginas no conocen el envoltorio {success, message, data}
  return json?.data
}

// Atajos por metodo HTTP que usan todas las paginas (api.get, api.post, etc.)
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  putForm: (path, formData) => request(path, { method: 'PUT', formData }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { API_URL }
