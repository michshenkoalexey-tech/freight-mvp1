import React, { createContext, useContext, useEffect, useState } from 'react'

type Role = 'customer' | 'driver' | 'admin'
interface User { id: number; role: Role; name: string; email: string }
interface AuthContextValue {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (role: Role, name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
  }, [])

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

  const login = async (email: string, password: string) => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const register = async (role: Role, name: string, email: string, password: string) => {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ role, name, email, password }) })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = () => { setToken(null); setUser(null); localStorage.clear() }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
