import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function ChatPanel({ shipmentId }: { shipmentId: number }) {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [body, setBody] = useState('')

  const load = async () => {
    const res = await fetch(import.meta.env.VITE_API_URL + `/messages/${shipmentId}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => { load() }, [shipmentId])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(import.meta.env.VITE_API_URL + `/messages/${shipmentId}`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ body }) })
    setBody('')
    load()
  }

  return (
    <div className="card">
      <div className="font-medium">Chat</div>
      <div className="mt-2 space-y-2 max-h-64 overflow-auto">
        {messages.map(m => (
          <div key={m.id} className="text-sm"><span className="text-white/60">{m.sender_id === user?.id ? 'Me' : `User ${m.sender_id}`}:</span> {m.body}</div>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input className="input flex-1" placeholder="Type a message" value={body} onChange={e=>setBody(e.target.value)} />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  )
}
