import type { Request, Response } from "express"
import { prisma } from "../index.js"

const DEFAULT_USER_ID = "default-user-id" // Assume single logged-in user

export async function getAllEventTypes(req: Request, res: Response) {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: DEFAULT_USER_ID },
    })
    res.json(eventTypes)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event types" })
  }
}

export async function createEventType(req: Request, res: Response) {
  try {
    const { name, duration, slug, bufferBefore = 0, bufferAfter = 0 } = req.body

    // Input validation is handled by middleware now
    const eventType = await prisma.eventType.create({
      data: {
        userId: DEFAULT_USER_ID,
        name,
        duration: Number.parseInt(duration),
        slug: slug.toLowerCase(),
        bufferBefore: Number.parseInt(bufferBefore),
        bufferAfter: Number.parseInt(bufferAfter),
      },
    })

    res.status(201).json(eventType)
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Slug must be unique" })
    }
    console.error("Error creating event type:", error)
    res.status(500).json({ error: "Failed to create event type" })
  }
}

export async function getEventType(req: Request, res: Response) {
  try {
    const { id } = req.params
    const eventType = await prisma.eventType.findUnique({
      where: { id },
    })

    if (!eventType) {
      return res.status(404).json({ error: "Event type not found" })
    }

    res.json(eventType)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event type" })
  }
}

export async function updateEventType(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, duration, bufferBefore, bufferAfter } = req.body

    const eventType = await prisma.eventType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(duration && { duration }),
        ...(bufferBefore !== undefined && { bufferBefore }),
        ...(bufferAfter !== undefined && { bufferAfter }),
      },
    })

    res.json(eventType)
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Event type not found" })
    }
    res.status(500).json({ error: "Failed to update event type" })
  }
}

export async function deleteEventType(req: Request, res: Response) {
  try {
    const { id } = req.params
    await prisma.eventType.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Event type not found" })
    }
    res.status(500).json({ error: "Failed to delete event type" })
  }
}
