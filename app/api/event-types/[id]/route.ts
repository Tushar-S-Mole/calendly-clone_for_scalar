import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

const DEFAULT_USER_ID = 1

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const eventType = await prisma.eventType.findUnique({
      where: { id },
    })
    if (!eventType || eventType.userId !== DEFAULT_USER_ID) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(eventType)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event type" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, duration, bufferBefore, bufferAfter } = body

    const eventType = await prisma.eventType.findUnique({
      where: { id },
    })
    if (!eventType || eventType.userId !== DEFAULT_USER_ID) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.eventType.update({
      where: { id },
      data: {
        name: name || eventType.name,
        duration: duration || eventType.duration,
        bufferBefore: bufferBefore !== undefined ? bufferBefore : eventType.bufferBefore,
        bufferAfter: bufferAfter !== undefined ? bufferAfter : eventType.bufferAfter,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event type" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const eventType = await prisma.eventType.findUnique({
      where: { id },
    })
    if (!eventType || eventType.userId !== DEFAULT_USER_ID) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.eventType.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event type" }, { status: 500 })
  }
}
