import type { Request, Response } from "express"
import { prisma } from "../index.js"

const DEFAULT_USER_ID = "default-user-id"

export async function getAvailability(req: Request, res: Response) {
  try {
    const availability = await prisma.availability.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { dayOfWeek: "asc" },
    })
    res.json(availability)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" })
  }
}

export async function createAvailability(req: Request, res: Response) {
  try {
    const { dayOfWeek, startTime, endTime } = req.body

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if availability already exists for this day
    const existing = await prisma.availability.findUnique({
      where: {
        userId_dayOfWeek: {
          userId: DEFAULT_USER_ID,
          dayOfWeek,
        },
      },
    })

    if (existing) {
      return res.status(400).json({ error: "Availability already exists for this day" })
    }

    const availability = await prisma.availability.create({
      data: {
        userId: DEFAULT_USER_ID,
        dayOfWeek,
        startTime,
        endTime,
      },
    })

    res.status(201).json(availability)
  } catch (error) {
    res.status(500).json({ error: "Failed to create availability" })
  }
}

export async function updateAvailability(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { startTime, endTime } = req.body

    const availability = await prisma.availability.update({
      where: { id },
      data: {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
      },
    })

    res.json(availability)
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Availability not found" })
    }
    res.status(500).json({ error: "Failed to update availability" })
  }
}

export async function deleteAvailability(req: Request, res: Response) {
  try {
    const { id } = req.params
    await prisma.availability.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Availability not found" })
    }
    res.status(500).json({ error: "Failed to delete availability" })
  }
}
