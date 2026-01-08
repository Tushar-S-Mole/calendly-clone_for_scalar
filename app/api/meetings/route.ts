import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { addMinutes } from "@/lib/utils"

// ✅ userId must be a NUMBER
const DEFAULT_USER_ID = 1

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { eventType: true },
      orderBy: { startTime: "desc" },
    })
    return NextResponse.json(meetings)
  } catch (error) {
    console.error("GET /api/meetings error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, inviteeName, inviteeEmail, date, time } = body

    if (!slug || !inviteeName || !inviteeEmail || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const eventType = await prisma.eventType.findUnique({
      where: { slug },
    })

    if (!eventType) {
      return NextResponse.json(
        { error: "Event type not found" },
        { status: 404 }
      )
    }

    const selectedDate = new Date(date)
    const [timeHour, timeMin] = time.split(":").map(Number)

    const startTime = new Date(selectedDate)
    startTime.setHours(timeHour, timeMin, 0, 0)

    const endTime = addMinutes(startTime, eventType.duration)

    const existingMeetings = await prisma.meeting.findMany({
      where: {
        eventTypeId: eventType.id,
        startTime: {
          lt: addMinutes(endTime, eventType.bufferAfter),
        },
        endTime: {
          gt: new Date(
            startTime.getTime() - eventType.bufferBefore * 60000
          ),
        },
      },
    })

    if (existingMeetings.length > 0) {
      return NextResponse.json(
        { error: "Slot is no longer available" },
        { status: 409 }
      )
    }

    const meeting = await prisma.meeting.create({
      data: {
        userId: DEFAULT_USER_ID, // ✅ NUMBER
        eventTypeId: eventType.id,
        inviteeName,
        inviteeEmail,
        startTime,
        endTime,
      },
      include: { eventType: true },
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error("POST /api/meetings error:", error)
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    )
  }
}
