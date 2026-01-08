import type { Request, Response } from "express"
import { prisma } from "../index.js"

const DEFAULT_USER_ID = "default-user-id"

export async function getAllMeetings(req: Request, res: Response) {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { eventType: true },
      orderBy: { startTime: "desc" },
    })
    res.json(meetings)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meetings" })
  }
}

export async function createMeeting(req: Request, res: Response) {
  try {
    const { eventTypeId, inviteeName, inviteeEmail, startTime, endTime } = req.body

    if (!eventTypeId || !inviteeName || !inviteeEmail || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check for double booking
    const conflictingMeeting = await prisma.meeting.findFirst({
      where: {
        eventTypeId,
        OR: [
          { startTime: { lt: new Date(endTime), gte: new Date(startTime) } },
          { endTime: { gt: new Date(startTime), lte: new Date(endTime) } },
        ],
      },
    })

    if (conflictingMeeting) {
      return res.status(409).json({ error: "Time slot already booked" })
    }

    const meeting = await prisma.meeting.create({
      data: {
        userId: DEFAULT_USER_ID,
        eventTypeId,
        inviteeName,
        inviteeEmail,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: { eventType: true },
    })

    res.status(201).json(meeting)
  } catch (error) {
    res.status(500).json({ error: "Failed to create meeting" })
  }
}

export async function getMeeting(req: Request, res: Response) {
  try {
    const { id } = req.params
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { eventType: true },
    })

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" })
    }

    res.json(meeting)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meeting" })
  }
}

export async function cancelMeeting(req: Request, res: Response) {
  try {
    const { id } = req.params
    await prisma.meeting.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Meeting not found" })
    }
    res.status(500).json({ error: "Failed to cancel meeting" })
  }
}
