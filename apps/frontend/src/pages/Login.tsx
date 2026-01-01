import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()
  const { login, user } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      if (!user) { /* user will update after login */ }
      // Assume backend returns role
      // Quick redirect based on email for demo
      if (email === 'admin@example.com') nav('/admin')
      else if (email.includes('driver')) nav('/driver')
      else nav('/customer')
    } catch (e: any) { setError(e.message) }
  }

  return (
    <main className="container-px py-10 max-w-md">
      <h1 className="text-2xl font-semibold">Login</h1>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="input w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Login</button>
      </form>
    </main>
  )
}
