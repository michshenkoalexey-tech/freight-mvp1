import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function MyJobs() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/bookings', { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()).then(setJobs)
  },[token])
  return (
    <main className="container-px py-6">
      <h1 className="text-2xl font-semibold">My jobs</h1>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {jobs.map(j=> (
          <div key={j.id} className="card">
            <div className="font-medium">Booking #{j.id}</div>
            <div className="text-sm text-white/70">Price: ${'{'}j.agreed_price{'}'}</div>
            <div className="text-sm text-white/70">Status: {j.status}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
