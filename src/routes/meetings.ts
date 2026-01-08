import express from "express"
import * as meetingController from "../controllers/meetingController.js"

const router = express.Router()

router.get("/", meetingController.getAllMeetings)
router.post("/", meetingController.createMeeting)
router.get("/:id", meetingController.getMeeting)
router.delete("/:id", meetingController.cancelMeeting)

export default router
