import type { Request, Response, NextFunction } from "express"

export function validateEventTypeInput(req: Request, res: Response, next: NextFunction) {
  const { name, duration, slug } = req.body

  if (!name || !duration || !slug) {
    return res.status(400).json({ error: "Missing required fields: name, duration, slug" })
  }

  if (duration <= 0) {
    return res.status(400).json({ error: "Duration must be positive" })
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: "Slug must be lowercase alphanumeric with hyphens" })
  }

  next()
}

export function validateBookingInput(req: Request, res: Response, next: NextFunction) {
  const { inviteeName, inviteeEmail, eventTypeId, startTime } = req.body

  if (!inviteeName || !inviteeEmail || !eventTypeId || !startTime) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteeEmail)) {
    return res.status(400).json({ error: "Invalid email format" })
  }

  next()
}
