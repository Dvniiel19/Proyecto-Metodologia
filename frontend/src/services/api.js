const API_URL = 'http://localhost:8001'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, { method = 'GET', body, formData } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
  })

  const json = await res.json().catch(() => null)

  if (res.status === 401 && getToken()) {
    // Token vencido o invalido: cerramos sesion y mandamos al login
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }

  if (!res.ok || json?.success === false) {
    const error = new Error(json?.message || `Error ${res.status}`)
    error.status = res.status
    error.errors = json?.errors || null
    throw error
  }

  return json?.data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  putForm: (path, formData) => request(path, { method: 'PUT', formData }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { API_URL }
