import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getDateAtTime, addMinutes, getDayOfWeek } from "@/lib/utils"

const DEFAULT_USER_ID = 1

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")
    const date = searchParams.get("date")

    if (!slug || !date) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const selectedDate = new Date(date)
    const dayOfWeek = getDayOfWeek(selectedDate)

    // Get event type by slug
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
    })
    if (!eventType) {
      return NextResponse.json({ error: "Event type not found" }, { status: 404 })
    }

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
      return NextResponse.json([])
    }

    // Get all meetings for this event type on this date
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(selectedDate)
    dayEnd.setHours(23, 59, 59, 999)

    const meetings = await prisma.meeting.findMany({
      where: {
        eventTypeId: eventType.id,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    })

    // Generate available slots
    const slots: string[] = []
    const [startHour, startMin] = availability.startTime.split(":").map(Number)
    const [endHour, endMin] = availability.endTime.split(":").map(Number)

    let currentSlotStart = getDateAtTime(
      selectedDate,
      `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`,
    )
    const dayEndsAt = getDateAtTime(
      selectedDate,
      `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`,
    )

    while (currentSlotStart < dayEndsAt) {
      const slotEnd = addMinutes(currentSlotStart, eventType.duration + eventType.bufferAfter)

      // Check if slot overlaps with any meeting (including buffer times)
      const isBooked = meetings.some((meeting) => {
        const meetingStart = new Date(meeting.startTime)
        const meetingEnd = new Date(meeting.endTime)
        const bufferStart = new Date(meetingStart.getTime() - eventType.bufferBefore * 60000)
        const bufferEnd = new Date(meetingEnd.getTime() + eventType.bufferAfter * 60000)

        return currentSlotStart < bufferEnd && slotEnd > bufferStart
      })

      if (!isBooked && slotEnd <= dayEndsAt) {
        const hours = String(currentSlotStart.getHours()).padStart(2, "0")
        const minutes = String(currentSlotStart.getMinutes()).padStart(2, "0")
        slots.push(`${hours}:${minutes}`)
      }

      currentSlotStart = addMinutes(currentSlotStart, 30) // 30-minute increments
    }

    return NextResponse.json(slots)
  } catch (error) {
    console.error("[v0] Error generating slots:", error)
    return NextResponse.json({ error: "Failed to generate slots" }, { status: 500 })
  }
}
