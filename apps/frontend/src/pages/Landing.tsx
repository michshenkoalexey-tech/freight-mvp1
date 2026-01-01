import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="container-px py-10">
      <h1 className="text-3xl font-semibold">Freight marketplace</h1>
      <p className="mt-2 text-white/70">Connect shippers and carriers. Track quotes, bookings, and deliveries.</p>
      <div className="mt-6 flex gap-3">
        <Link className="btn" to="/signup">Get started</Link>
        <a className="btn" href="#docs">Learn more</a>
      </div>
    </main>
  )
}
