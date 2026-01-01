import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function CustomerDashboard() {
  const { token } = useAuth()
  const [shipments, setShipments] = useState<any[]>([])
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/shipments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setShipments).catch(()=>{})
  }, [token])
  return (
    <main className="container-px py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My shipments</h1>
        <a className="btn" href="/customer/new">Create shipment</a>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shipments.map(s => (
          <a key={s.id} className="card block" href={`/customer/shipment/${s.id}`}>
            <div className="font-medium">{s.pickup_city} → {s.dropoff_city}</div>
            <div className="text-sm text-white/70">Status: {s.status}</div>
          </a>
        ))}
      </div>
    </main>
  )
}
