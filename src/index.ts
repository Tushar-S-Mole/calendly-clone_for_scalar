import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import validationMiddleware from "./middlewares/validation.js"

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// Import routes
import eventTypeRoutes from "./routes/eventTypes.js"
import availabilityRoutes from "./routes/availability.js"
import meetingRoutes from "./routes/meetings.js"
import slotsRoutes from "./routes/slots.js"

// Apply middlewares to specific routes
app.post("/api/event-types", validationMiddleware.validateEventTypeInput, eventTypeRoutes)
app.post("/api/meetings", validationMiddleware.validateBookingInput, meetingRoutes)

// Use routes
app.use("/api/event-types", eventTypeRoutes)
app.use("/api/availability", availabilityRoutes)
app.use("/api/meetings", meetingRoutes)
app.use("/api/slots", slotsRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { prisma }
