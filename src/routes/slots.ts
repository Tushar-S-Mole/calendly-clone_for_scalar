import express from "express"
import * as slotController from "../controllers/slotController.js"

const router = express.Router()

router.get("/:slug/:date", slotController.getAvailableSlots)

export default router
