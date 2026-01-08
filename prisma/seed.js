import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      timezone: "UTC",
    },
  });

  // Create event types
  const event1 = await prisma.eventType.create({
    data: {
      name: "30 min Consultation",
      duration: 30,
      slug: "30min-consultation",
      bufferAfter: 15,
      userId: user.id,
    },
  });

  const event2 = await prisma.eventType.create({
    data: {
      name: "1 Hour Meeting",
      duration: 60,
      slug: "1hour-meeting",
      bufferBefore: 10,
      bufferAfter: 10,
      userId: user.id,
    },
  });

  // Availability: Monday–Friday, 9–5
  for (let day = 1; day <= 5; day++) {
    await prisma.availability.create({
      data: {
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        userId: user.id,
      },
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
