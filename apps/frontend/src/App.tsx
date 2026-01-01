import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import ShipmentForm from './pages/customer/ShipmentForm'
import ShipmentDetail from './pages/customer/ShipmentDetail'
import DriverDashboard from './pages/driver/DriverDashboard'
import MyQuotes from './pages/driver/MyQuotes'
import MyJobs from './pages/driver/MyJobs'
import Earnings from './pages/driver/Earnings'
import AdminDashboard from './pages/admin/AdminDashboard'
import BlockedBanner from './components/BlockedBanner'

function RequireAuth({ children, role }: { children: React.ReactNode, role?: 'customer'|'driver'|'admin' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

function AuthedNav() {
  const { user, logout } = useAuth()
  if (!user) return (<>
    <Link to="/login" className="hover:underline">Login</Link>
    <Link to="/signup" className="hover:underline">Sign up</Link>
  </>)
  return (
    <>
      {user.role === 'customer' && <Link to="/customer" className="hover:underline">Customer</Link>}
      {user.role === 'driver' && <Link to="/driver" className="hover:underline">Driver</Link>}
      {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
      <button onClick={logout} className="hover:underline">Logout</button>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <BlockedBanner />
        <nav className="border-b border-white/10 p-3 flex gap-3">
          <Link to="/" className="hover:underline">Freight</Link>
          <div className="ml-auto flex gap-3 text-sm">
            <AuthedNav />
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<RequireAuth role="customer"><CustomerDashboard /></RequireAuth>} />
          <Route path="/customer/new" element={<RequireAuth role="customer"><ShipmentForm /></RequireAuth>} />
          <Route path="/customer/shipment/:id" element={<RequireAuth role="customer"><ShipmentDetail /></RequireAuth>} />
          <Route path="/driver" element={<RequireAuth role="driver"><DriverDashboard /></RequireAuth>} />
          <Route path="/driver/quotes" element={<RequireAuth role="driver"><MyQuotes /></RequireAuth>} />
          <Route path="/driver/jobs" element={<RequireAuth role="driver"><MyJobs /></RequireAuth>} />
          <Route path="/driver/earnings" element={<RequireAuth role="driver"><Earnings /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
