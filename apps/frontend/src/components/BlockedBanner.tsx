import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function BlockedBanner() {
  const { user, token } = useAuth()
  const [status, setStatus] = useState<'Active'|'Suspended'|'Blocked'|null>(null)
  const [reason, setReason] = useState<string|undefined>()
  useEffect(() => {
    if (!user) return
    fetch(import.meta.env.VITE_API_URL + `/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r=>r.json()).then(u=>{ setStatus(u.status); setReason(u.blocked_reason) }).catch(()=>{})
  }, [user, token])
  if (!user || status === 'Active' || !status) return null
  return (
    <div className="bg-yellow-500/10 border border-yellow-400/20 text-yellow-200 px-4 py-2 text-sm">
      Your account is {status}. {reason ? `Reason: ${reason}` : 'Please resolve billing to continue.'}
    </div>
  )
}
