import { env } from '@/env'

export function useApi() {
  const fetchApi = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => { 
    // We rely on HTTP-only cookies now, so we don't manually attach tokens.
    // 'credentials: include' ensures cookies are sent.
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL || env.VITE_API_URL}${endpoint}`, {
      ...options,
      credentials: 'include', 
      headers,
    })

    if (!res.ok) { 
      const error = await res.json().catch(() => ({}))
      
      // Optional: Auto redirect on 401
      if (res.status === 401) {
          window.location.href = '/login'
      }

      throw new Error(error.message || 'API Request Failed')
    }

    return res.json()
  }

  return { fetchApi }
}