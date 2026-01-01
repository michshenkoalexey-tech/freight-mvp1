import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function MyQuotes() {
  const { token } = useAuth()
  const [quotes, setQuotes] = useState<any[]>([])
  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/quotes/mine', { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()).then(setQuotes)
  },[token])
  return (
    <main className="container-px py-6">
      <h1 className="text-2xl font-semibold">My quotes</h1>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quotes.map(q=> (
          <div key={q.id} className="card">
            <div className="font-medium">Shipment #{q.shipment_id}</div>
            <div className="text-sm text-white/70">Price: ${'{'}q.price{'}'}</div>
            <div className="text-sm text-white/70">Status: {q.status}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
