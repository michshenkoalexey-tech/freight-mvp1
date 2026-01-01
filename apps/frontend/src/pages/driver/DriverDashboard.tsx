import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function DriverDashboard() {
  const { token } = useAuth()
  const [shipments, setShipments] = useState<any[]>([])
  const [prices, setPrices] = useState<Record<number,string>>({})
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/shipments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setShipments).catch(()=>{})
  }, [token])

  const submitQuote = async (shipment_id: number) => {
    const price = Number(prices[shipment_id])
    if (!price) return
    await fetch(import.meta.env.VITE_API_URL + '/quotes', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ shipment_id, price }) })
    alert('Quote submitted')
  }

  return (
    <main className="container-px py-6">
      <h1 className="text-2xl font-semibold">Available loads</h1>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shipments.map(s => (
          <div key={s.id} className="card space-y-2">
            <div className="font-medium">{s.pickup_city} → {s.dropoff_city}</div>
            <div className="text-sm text-white/70">Status: {s.status}</div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Your price" value={prices[s.id]||''} onChange={e=>setPrices(p=>({...p,[s.id]:e.target.value}))} />
              <button className="btn" onClick={()=>submitQuote(s.id)}>Quote</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
