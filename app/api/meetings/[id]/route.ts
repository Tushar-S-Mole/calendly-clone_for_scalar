import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_USER_ID = 1

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const meeting = await prisma.meeting.findUnique({
      where: { id },
    })
    if (!meeting || meeting.userId !== DEFAULT_USER_ID) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.meeting.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 })
  }
}
