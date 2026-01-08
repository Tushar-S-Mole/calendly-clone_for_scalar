import type { Request, Response } from "express"
import { prisma } from "../index.js"

const DEFAULT_USER_ID = "default-user-id"

// Helper function to convert time string (HH:mm) to minutes
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to convert minutes to time string (HH:mm)
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { slug, date } = req.params

    // Get event type by slug
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
    })

    if (!eventType) {
      return res.status(404).json({ error: "Event type not found" })
    }

    // Parse the date (format: YYYY-MM-DD)
    const selectedDate = new Date(date)
    const dayOfWeek = selectedDate.getDay()

    // Get availability for this day
    const availability = await prisma.availability.findUnique({
      where: {
        userId_dayOfWeek: {
          userId: DEFAULT_USER_ID,
          dayOfWeek,
        },
      },
    })

    if (!availability) {
      return res.json([])
    }

    // Get all bookings for this event type on this date
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(selectedDate)
    dayEnd.setHours(23, 59, 59, 999)

    const bookedMeetings = await prisma.meeting.findMany({
      where: {
        eventTypeId: eventType.id,
        startTime: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
    })

    // Generate available slots
    const slots: string[] = []
    const startMinutes = timeToMinutes(availability.startTime)
    const endMinutes = timeToMinutes(availability.endTime)
    const duration = eventType.duration
    const bufferBefore = eventType.bufferBefore
    const bufferAfter = eventType.bufferAfter

    // Create slots every duration minutes
    for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += 15) {
      const slotStart = new Date(selectedDate)
      slotStart.setHours(0, 0, 0, 0)
      slotStart.setMinutes(slotStart.getMinutes() + currentMinutes)

      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + duration)

      // Check for conflicts considering buffer time
      const bufferStart = new Date(slotStart)
      bufferStart.setMinutes(bufferStart.getMinutes() - bufferBefore)

      const bufferEnd = new Date(slotEnd)
      bufferEnd.setMinutes(bufferEnd.getMinutes() + bufferAfter)

      const isAvailable = !bookedMeetings.some((meeting) => {
        return bufferStart < meeting.endTime && bufferEnd > meeting.startTime
      })

      if (isAvailable) {
        slots.push(slotStart.toISOString())
      }
    }

    res.json(slots)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available slots" })
  }
}
