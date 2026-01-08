import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// ✅ userId must be a NUMBER
const DEFAULT_USER_ID = 1

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (slug) {
      const eventType = await prisma.eventType.findUnique({
        where: { slug },
      })

      return NextResponse.json(eventType ? [eventType] : [])
    }

    const eventTypes = await prisma.eventType.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(eventTypes)
  } catch (error) {
    console.error("GET /api/event-types error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, duration, slug, bufferBefore, bufferAfter } = body

    if (!name || !duration || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const eventType = await prisma.eventType.create({
      data: {
        userId: DEFAULT_USER_ID, // ✅ NUMBER
        name,
        duration,
        slug,
        bufferBefore: bufferBefore ?? 0,
        bufferAfter: bufferAfter ?? 0,
      },
    })

    return NextResponse.json(eventType, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      )
    }

    console.error("POST /api/event-types error:", error)
    return NextResponse.json(
      { error: "Failed to create event type" },
      { status: 500 }
    )
  }
}
