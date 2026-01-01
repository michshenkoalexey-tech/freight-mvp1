import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth, AuthedRequest } from '../middleware/auth.js'

export const reportsRouter = Router()
reportsRouter.use(requireAuth)

reportsRouter.post('/', (req: AuthedRequest, res) => {
  const reporter = req.user!.sub
  const { target_user_id, reason } = req.body as { target_user_id: number, reason: string }
  const info = db.prepare('INSERT INTO reports(reporter_id, target_user_id, reason) VALUES (?,?,?)')
    .run(reporter, target_user_id, reason)
  res.json({ id: Number(info.lastInsertRowid) })
})
