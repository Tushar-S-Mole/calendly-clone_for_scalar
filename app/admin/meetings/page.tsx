"use client"

import { useEffect, useState } from "react"
import MeetingList from "@/components/meetings/meeting-list"

interface Meeting {
  id: string
  inviteeName: string
  inviteeEmail: string
  startTime: string
  endTime: string
  eventType: {
    name: string
  }
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/meetings")
      const data = await response.json()
      setMeetings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch meetings:", error)
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return

    try {
      await fetch(`/api/meetings/${id}`, {
        method: "DELETE",
      })
      await fetchMeetings()
    } catch (error) {
      console.error("Failed to cancel meeting:", error)
    }
  }

  const now = new Date()
  const filteredMeetings = meetings.filter((meeting) => {
    const meetingTime = new Date(meeting.startTime)
    return filter === "upcoming"
      ? meetingTime >= now
      : meetingTime < now
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "past"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading meetings...
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No {filter} meetings
        </div>
      ) : (
        <MeetingList
          meetings={filteredMeetings}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
