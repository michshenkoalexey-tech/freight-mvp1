import React, { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [market, setMarket] = useState<any>({ shipments: [], quotes: [], bookings: [] })
  const [selectedUser, setSelectedUser] = useState<number|undefined>()
  const [invoices, setInvoices] = useState<any[]>([])
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setUsers).catch(()=>{})
    fetch(import.meta.env.VITE_API_URL + '/admin/marketplace', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setMarket).catch(()=>{})
  }, [token])

  const loadInvoices = async (uid:number) => {
    setSelectedUser(uid)
    const data = await fetch(import.meta.env.VITE_API_URL + `/billing/user/${uid}`, { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json())
    setInvoices(data)
  }

  const markInvoice = async (invoice_id:number, status:'Paid'|'Unpaid'|'PastDue') => {
    await fetch(import.meta.env.VITE_API_URL + '/billing/mark', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ invoice_id, status }) })
    if (selectedUser) loadInvoices(selectedUser)
  }

  const cancelShipment = async (id:number) => {
    await fetch(import.meta.env.VITE_API_URL + `/admin/shipments/${id}/cancel`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ reason: 'Admin cancellation' }) })
    const data = await fetch(import.meta.env.VITE_API_URL + '/admin/marketplace', { headers:{ Authorization:`Bearer ${token}` } }).then(r=>r.json())
    setMarket(data)
  }

  const block = async (id: number) => {
    await fetch(import.meta.env.VITE_API_URL + `/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'Blocked', blocked_reason: 'Blocked for non-payment' })
    })
    setUsers(users.map(u => u.id === id ? { ...u, status: 'Blocked' } : u))
  }

  return (
    <main className="container-px py-6 space-y-8">
      <section>
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="text-white/70">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2">{u.status}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <button className="btn" onClick={()=>block(u.id)}>Block for non-payment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Marketplace</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <div className="card"><div className="font-medium">Shipments</div><div className="text-2xl">{market.shipments.length}</div></div>
          <div className="card"><div className="font-medium">Quotes</div><div className="text-2xl">{market.quotes.length}</div></div>
          <div className="card"><div className="font-medium">Bookings</div><div className="text-2xl">{market.bookings.length}</div></div>
        </div>
        <div className="mt-4">
          <div className="font-medium mb-2">Recent Shipments</div>
          <div className="grid md:grid-cols-2 gap-3">
            {market.shipments.slice(0,6).map((s:any)=> (
              <div key={s.id} className="card flex items-center justify-between">
                <div className="text-sm">#{s.id} {s.pickup_city} → {s.dropoff_city} — {s.status}</div>
                {s.status !== 'Cancelled' && <button className="btn" onClick={()=>cancelShipment(s.id)}>Cancel</button>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Payments & Invoices</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <div className="card md:col-span-1">
            <div className="font-medium">Users</div>
            <ul className="mt-2 space-y-2 max-h-64 overflow-auto">
              {users.map(u => (
                <li key={u.id} className="flex items-center justify-between">
                  <span>{u.name}</span>
                  <button className="btn" onClick={()=>loadInvoices(u.id)}>View</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <div className="font-medium">Invoices {selectedUser && `(User #${selectedUser})`}</div>
            <table className="w-full text-sm mt-2">
              <thead className="text-white/70">
                <tr><th className="text-left p-2">ID</th><th className="text-left p-2">Plan</th><th className="text-left p-2">Amount</th><th className="text-left p-2">Status</th><th className="text-left p-2">Due</th><th className="text-left p-2">Actions</th></tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-t border-white/10">
                    <td className="p-2">{inv.id}</td>
                    <td className="p-2">{inv.plan}</td>
                    <td className="p-2">${'{'}inv.amount{'}'}</td>
                    <td className="p-2">{inv.status}</td>
                    <td className="p-2">{new Date(inv.due_date).toLocaleDateString()}</td>
                    <td className="p-2 space-x-2">
                      <button className="btn" onClick={()=>markInvoice(inv.id,'Paid')}>Mark Paid</button>
                      <button className="btn" onClick={()=>markInvoice(inv.id,'Unpaid')}>Mark Unpaid</button>
                      <button className="btn" onClick={()=>markInvoice(inv.id,'PastDue')}>Past Due</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
