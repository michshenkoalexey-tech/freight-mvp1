import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function Earnings() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/bookings', { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json()).then(setJobs)
  },[token])
  const total = useMemo(()=> jobs.reduce((s,j)=> s + (j.agreed_price||0), 0), [jobs])
  return (
    <main className="container-px py-6">
      <h1 className="text-2xl font-semibold">Earnings</h1>
      <div className="mt-4 card">
        <div className="text-white/70 text-sm">Total</div>
        <div className="text-3xl">${'{'}total.toFixed(2){'}'}</div>
      </div>
    </main>
  )
}
