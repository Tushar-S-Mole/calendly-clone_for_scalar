"use client"

import { useEffect, useState } from "react"
import EventTypeForm from "@/components/event-types/event-type-form"
import EventTypeList from "@/components/event-types/event-type-list"

interface EventType {
  id: string
  name: string
  duration: number
  slug: string
  bufferBefore: number
  bufferAfter: number
}

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchEventTypes = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/event-types")
      const data = await response.json()

      // ✅ FIX: always ensure array
      if (Array.isArray(data)) {
        setEventTypes(data)
      } else if (Array.isArray(data.eventTypes)) {
        setEventTypes(data.eventTypes)
      } else {
        console.error("Unexpected API response:", data)
        setEventTypes([])
      }

    } catch (error) {
      console.error("Failed to fetch event types:", error)
      setEventTypes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventTypes()
  }, [])

  const handleSave = async () => {
    setShowForm(false)
    setEditingId(null)
    await fetchEventTypes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event type?")) return

    try {
      await fetch(`/api/event-types/${id}`, { method: "DELETE" })
      await fetchEventTypes()
    } catch (error) {
      console.error("Failed to delete event type:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Types</h1>
        <button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "Create Event Type"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
          <EventTypeForm
            onSave={handleSave}
            editingId={editingId}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading event types...
        </div>
      ) : eventTypes.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No event types created yet
        </div>
      ) : (
        <EventTypeList
          eventTypes={eventTypes}
          onEdit={(id) => {
            setEditingId(id)
            setShowForm(true)
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
