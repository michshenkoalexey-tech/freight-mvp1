import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth, requireRole, AuthedRequest } from '../middleware/auth.js'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireRole('admin'))

// Marketplace monitoring
adminRouter.get('/marketplace', (_req, res) => {
  const shipments = db.prepare('SELECT * FROM shipments ORDER BY created_at DESC').all()
  const quotes = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all()
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
  res.json({ shipments, quotes, bookings })
})

adminRouter.post('/shipments/:id/cancel', (req: AuthedRequest, res) => {
  const id = Number(req.params.id)
  const { reason } = req.body as { reason?: string }
  db.prepare("UPDATE shipments SET status = 'Cancelled' WHERE id = ?").run(id)
  db.prepare('INSERT INTO audit_logs(actor_id, action, shipment_id, metadata, created_at) VALUES (?,?,?,?, CURRENT_TIMESTAMP)')
    .run(req.user!.sub, 'SHIPMENT_CANCELLED', id, JSON.stringify({ reason }))
  res.json({ ok: true })
})

adminRouter.post('/bookings/:id/cancel', (req: AuthedRequest, res) => {
  const id = Number(req.params.id)
  const { reason } = req.body as { reason?: string }
  db.prepare("UPDATE bookings SET status = 'Cancelled' WHERE id = ?").run(id)
  db.prepare('INSERT INTO audit_logs(actor_id, action, metadata, created_at) VALUES (?,?,?, CURRENT_TIMESTAMP)')
    .run(req.user!.sub, 'BOOKING_CANCELLED', JSON.stringify({ booking_id: id, reason }))
  res.json({ ok: true })
})

// Reports / disputes
adminRouter.get('/reports', (_req, res) => {
  const rows = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all()
  res.json(rows)
})

adminRouter.post('/reports/:id/resolve', (req: AuthedRequest, res) => {
  const id = Number(req.params.id)
  const { action_taken } = req.body as { action_taken: string }
  db.prepare("UPDATE reports SET status = 'Resolved', action_taken = ? WHERE id = ?").run(action_taken, id)
  db.prepare('INSERT INTO audit_logs(actor_id, action, metadata, created_at) VALUES (?,?,?, CURRENT_TIMESTAMP)')
    .run(req.user!.sub, 'REPORT_RESOLVED', JSON.stringify({ report_id: id, action_taken }))
  res.json({ ok: true })
})
