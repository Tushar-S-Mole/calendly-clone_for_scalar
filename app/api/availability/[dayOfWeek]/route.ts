import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_USER_ID = 1

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ dayOfWeek: string }> }) {
  try {
    const { dayOfWeek } = await params
    const day = Number.parseInt(dayOfWeek)

    const availability = await prisma.availability.findUnique({
      where: {
        userId_dayOfWeek: {
          userId: DEFAULT_USER_ID,
          dayOfWeek: day,
        },
      },
    })
    if (!availability) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.availability.delete({
      where: {
        userId_dayOfWeek: {
          userId: DEFAULT_USER_ID,
          dayOfWeek: day,
        },
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete availability" }, { status: 500 })
  }
}
