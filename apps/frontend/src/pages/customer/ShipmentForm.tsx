import React, { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ShipmentForm() {
  const { token } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState<any>({ pickup_city:'', pickup_address:'', dropoff_city:'', dropoff_address:'', pickup_window_start:'', pickup_window_end:'', trailer_type:'Dry Van', details:'', weight:'', volume:'', special_requirements:'', budget:'' })
  const [error, setError] = useState<string|null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/shipments', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      const data = await res.json()
      nav(`/customer/shipment/${data.id}`)
    } catch (e:any) { setError(e.message) }
  }

  const update = (k:string, v:any)=> setForm((f:any)=>({...f,[k]:v}))

  return (
    <main className="container-px py-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Create shipment</h1>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <form onSubmit={submit} className="mt-4 grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="Pickup city" value={form.pickup_city} onChange={e=>update('pickup_city', e.target.value)} />
        <input className="input" placeholder="Pickup address" value={form.pickup_address} onChange={e=>update('pickup_address', e.target.value)} />
        <input className="input" placeholder="Dropoff city" value={form.dropoff_city} onChange={e=>update('dropoff_city', e.target.value)} />
        <input className="input" placeholder="Dropoff address" value={form.dropoff_address} onChange={e=>update('dropoff_address', e.target.value)} />
        <input className="input" placeholder="Pickup window start (ISO)" value={form.pickup_window_start} onChange={e=>update('pickup_window_start', e.target.value)} />
        <input className="input" placeholder="Pickup window end (ISO)" value={form.pickup_window_end} onChange={e=>update('pickup_window_end', e.target.value)} />
        <input className="input" placeholder="Trailer type" value={form.trailer_type} onChange={e=>update('trailer_type', e.target.value)} />
        <input className="input" placeholder="Budget" value={form.budget} onChange={e=>update('budget', e.target.value)} />
        <textarea className="input sm:col-span-2" placeholder="Details" value={form.details} onChange={e=>update('details', e.target.value)} />
        <textarea className="input sm:col-span-2" placeholder="Special requirements" value={form.special_requirements} onChange={e=>update('special_requirements', e.target.value)} />
        <button className="btn sm:col-span-2" type="submit">Create</button>
      </form>
    </main>
  )
}
