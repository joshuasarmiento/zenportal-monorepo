import { useAuth } from '@clerk/vue'

const API_URL = import.meta.env.VITE_API_URL

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { getToken } = useAuth()
  const token = await getToken.value()

  // 1. Attach Auth Header
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // 2. Make Request
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // 3. Handle Errors
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'API Request Failed')
  }

  return res.json()
}