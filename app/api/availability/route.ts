import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// ✅ userId must be a NUMBER
const DEFAULT_USER_ID = 1

export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { dayOfWeek: "asc" },
    })
    return NextResponse.json(availability)
  } catch (error) {
    console.error("GET /api/availability error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dayOfWeek, startTime, endTime } = body

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const availability = await prisma.availability.upsert({
      where: {
        userId_dayOfWeek: {
          userId: DEFAULT_USER_ID, // ✅ NUMBER
          dayOfWeek,
        },
      },
      update: { startTime, endTime },
      create: {
        userId: DEFAULT_USER_ID, // ✅ NUMBER
        dayOfWeek,
        startTime,
        endTime,
      },
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error("POST /api/availability error:", error)
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    )
  }
}
