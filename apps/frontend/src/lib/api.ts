import { useAuth } from '../auth/AuthContext'

export function useApi() {
  const { token } = useAuth()
  const api = async (path: string, options: RequestInit = {}) => {
    const res = await fetch(import.meta.env.VITE_API_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })
    if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
    return res.json()
  }
  return { api }
}
