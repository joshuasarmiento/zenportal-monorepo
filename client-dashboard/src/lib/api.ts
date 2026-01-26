// src/lib/api.ts
import { useAuth } from '@clerk/vue'
import { env } from '@/env'

// Change from a regular function to a Composable "useApi"
export function useApi() {
  const { getToken } = useAuth() // This now runs inside the component setup!

  const fetchApi = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => { 
    const token = await getToken.value()

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const res = await fetch(`${ import.meta.env.VITE_API_URL || env.VITE_API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || 'API Request Failed')
    }

    return res.json()
  }

  return { fetchApi }
}