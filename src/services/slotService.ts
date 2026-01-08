import { prisma } from "../index.js"

// Helper to convert HH:mm to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

// Service to generate available slots for a given date
export async function generateAvailableSlots(eventTypeId: string, date: Date, userId: string) {
  // Get event type with buffer info
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
  })

  if (!eventType) {
    throw new Error("Event type not found")
  }

  const dayOfWeek = date.getDay()

  // Get availability for this specific day of week
  const availability = await prisma.availability.findUnique({
    where: {
      userId_dayOfWeek: {
        userId,
        dayOfWeek,
      },
    },
  })

  if (!availability) {
    return [] // No availability for this day
  }

  // Get all meetings booked for this event type on this date
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const bookedMeetings = await prisma.meeting.findMany({
    where: {
      eventTypeId,
      startTime: { gte: dayStart, lt: dayEnd },
    },
  })

  const slots: Date[] = []

  // Generate slots in 15-minute intervals
  const startMinutes = timeToMinutes(availability.startTime)
  const endMinutes = timeToMinutes(availability.endTime)
  const slotDuration = eventType.duration
  const bufferBefore = eventType.bufferBefore
  const bufferAfter = eventType.bufferAfter

  for (let currentMinutes = startMinutes; currentMinutes + slotDuration <= endMinutes; currentMinutes += 15) {
    const slotStart = new Date(date)
    slotStart.setHours(0, 0, 0, 0)
    slotStart.setMinutes(currentMinutes)

    const slotEnd = new Date(slotStart)
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration)

    // Calculate buffer-inclusive time range
    const bufferStartTime = new Date(slotStart)
    bufferStartTime.setMinutes(bufferStartTime.getMinutes() - bufferBefore)

    const bufferEndTime = new Date(slotEnd)
    bufferEndTime.setMinutes(bufferEndTime.getMinutes() + bufferAfter)

    // Check if this slot conflicts with any existing meetings
    const isConflicting = bookedMeetings.some(
      (meeting) => bufferStartTime < meeting.endTime && bufferEndTime > meeting.startTime,
    )

    if (!isConflicting) {
      slots.push(slotStart)
    }
  }

  return slots
}

// Service to check if a time slot is available
export async function isSlotAvailable(eventTypeId: string, startTime: Date, endTime: Date): Promise<boolean> {
  const conflictingMeeting = await prisma.meeting.findFirst({
    where: {
      eventTypeId,
      OR: [
        {
          startTime: { lt: endTime, gte: startTime },
        },
        {
          endTime: { gt: startTime, lte: endTime },
        },
      ],
    },
  })

  return !conflictingMeeting
}
