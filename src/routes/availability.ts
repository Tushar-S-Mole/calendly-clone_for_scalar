import express from "express"
import * as availabilityController from "../controllers/availabilityController.js"

const router = express.Router()

router.get("/", availabilityController.getAvailability)
router.post("/", availabilityController.createAvailability)
router.put("/:id", availabilityController.updateAvailability)
router.delete("/:id", availabilityController.deleteAvailability)

export default router
