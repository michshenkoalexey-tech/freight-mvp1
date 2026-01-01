import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Signup() {
  const [role, setRole] = useState<'customer'|'driver'>('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()
  const { register } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await register(role, name, email, password)
      nav(role === 'driver' ? '/driver' : '/customer')
    } catch (e: any) { setError(e.message) }
  }

  return (
    <main className="container-px py-10 max-w-md">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <select className="input w-full" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="customer">Customer</option>
          <option value="driver">Driver</option>
        </select>
        <input className="input w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Create account</button>
      </form>
    </main>
  )
}
