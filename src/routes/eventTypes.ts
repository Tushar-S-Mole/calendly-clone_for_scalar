import express from "express"
import * as eventTypeController from "../controllers/eventTypeController.js"

const router = express.Router()

router.get("/", eventTypeController.getAllEventTypes)
router.post("/", eventTypeController.createEventType)
router.get("/:id", eventTypeController.getEventType)
router.put("/:id", eventTypeController.updateEventType)
router.delete("/:id", eventTypeController.deleteEventType)

export default router
