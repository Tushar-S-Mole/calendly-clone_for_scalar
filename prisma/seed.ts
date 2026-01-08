import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: "default-user-id",
      email: "admin@example.com",
      name: "Admin User",
      timezone: "UTC",
    },
  })

  console.log("Created user:", user)

  // Create event types
  const eventType1 = await prisma.eventType.upsert({
    where: { slug: "30min-consultation" },
    update: {},
    create: {
      userId: user.id,
      name: "30 min Consultation",
      duration: 30,
      slug: "30min-consultation",
      bufferBefore: 0,
      bufferAfter: 15, // 15 min buffer after meeting
    },
  })

  const eventType2 = await prisma.eventType.upsert({
    where: { slug: "1hour-meeting" },
    update: {},
    create: {
      userId: user.id,
      name: "1 Hour Meeting",
      duration: 60,
      slug: "1hour-meeting",
      bufferBefore: 10, // 10 min buffer before
      bufferAfter: 10, // 10 min buffer after
    },
  })

  console.log("Created event types:", eventType1, eventType2)

  // Create availability (Monday to Friday, 9 AM to 5 PM)
  const availabilityData = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, // Monday
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" }, // Friday
  ]

  for (const data of availabilityData) {
    await prisma.availability.upsert({
      where: {
        userId_dayOfWeek: {
          userId: user.id,
          dayOfWeek: data.dayOfWeek,
        },
      },
      update: {},
      create: {
        userId: user.id,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    })
  }

  console.log("Created availability slots")

  // Create sample meetings
  const nextMonday = new Date()
  nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7))
  nextMonday.setHours(10, 0, 0, 0)

  const meeting1Start = new Date(nextMonday)
  const meeting1End = new Date(meeting1Start.getTime() + 30 * 60 * 1000)

  const meeting1 = await prisma.meeting.create({
    data: {
      userId: user.id,
      eventTypeId: eventType1.id,
      inviteeName: "John Doe",
      inviteeEmail: "john@example.com",
      startTime: meeting1Start,
      endTime: meeting1End,
    },
  })

  const meeting2Start = new Date(nextMonday)
  meeting2Start.setHours(14, 0, 0, 0)
  const meeting2End = new Date(meeting2Start.getTime() + 60 * 60 * 1000)

  const meeting2 = await prisma.meeting.create({
    data: {
      userId: user.id,
      eventTypeId: eventType2.id,
      inviteeName: "Jane Smith",
      inviteeEmail: "jane@example.com",
      startTime: meeting2Start,
      endTime: meeting2End,
    },
  })

  console.log("Created sample meetings:", meeting1, meeting2)

  console.log("Database seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
