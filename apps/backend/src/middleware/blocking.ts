import { Response, NextFunction } from 'express'
import { AuthedRequest } from './auth.js'
import { db } from '../db.js'

// Deny actions for users who are Blocked or have PastDue invoices
export function requireNotBlocked(req: AuthedRequest, res: Response, next: NextFunction) {
  const uid = req.user!.sub
  const user = db.prepare('SELECT status FROM users WHERE id = ?').get(uid) as { status: string } | undefined
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  if (user.status === 'Blocked') return res.status(403).json({ error: 'Blocked for non-payment or policy violation' })
  const pastDue = db.prepare("SELECT 1 FROM invoices WHERE user_id = ? AND status = 'PastDue' LIMIT 1").get(uid)
  if (pastDue) return res.status(403).json({ error: 'Account past due. Please resolve billing to continue.' })
  next()
}
