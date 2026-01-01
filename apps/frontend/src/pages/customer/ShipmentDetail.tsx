import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import ChatPanel from '../../components/ChatPanel'

export default function ShipmentDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [data, setData] = useState<any>(null)

  const load = async () => {
    const res = await fetch(import.meta.env.VITE_API_URL + `/shipments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    setData(json)
  }

  const accept = async (quoteId: number) => {
    await fetch(import.meta.env.VITE_API_URL + `/quotes/${quoteId}/accept`, { method:'POST', headers:{ Authorization:`Bearer ${token}` } })
    load()
  }

  useEffect(()=>{ load() }, [id])

  if (!data) return <main className="container-px py-6">Loading...</main>

  return (
    <main className="container-px py-6 grid lg:grid-cols-3 gap-4">
      <section className="lg:col-span-2 space-y-4">
        <div className="card">
          <div className="font-medium">Shipment</div>
          <div className="text-sm text-white/70">{data.shipment.pickup_city} → {data.shipment.dropoff_city}</div>
          <div className="text-sm text-white/70">Status: {data.shipment.status}</div>
        </div>
        <div className="card">
          <div className="font-medium">Quotes</div>
          <ul className="mt-2 space-y-2">
            {data.quotes.map((q:any)=> (
              <li key={q.id} className="flex items-center justify-between">
                <div>${'{'}q.price{'}'}</div>
                <button className="btn" onClick={()=>accept(q.id)}>Accept</button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <ChatPanel shipmentId={Number(id)} />
      </section>
    </main>
  )
}
