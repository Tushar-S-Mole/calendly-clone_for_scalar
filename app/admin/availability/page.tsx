"use client"

import { useEffect, useState } from "react"
import AvailabilityForm from "@/components/availability/availability-form"
import AvailabilityList from "@/components/availability/availability-list"

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/availability")
      const data = await response.json()
      setAvailability(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch availability:", error)
      setAvailability([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [])

  const handleSave = async () => {
    setEditingId(null)
    await fetchAvailability()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability?")) return

    try {
      await fetch(`/api/availability/${id}`, {
        method: "DELETE",
      })
      await fetchAvailability()
    } catch (error) {
      console.error("Failed to delete availability:", error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Set Your Availability
      </h1>

      <AvailabilityForm onSave={handleSave} editingId={editingId} />

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading availability...
        </div>
      ) : availability.length === 0 ? (
        <div className="text-center py-12 text-gray-600 mt-8">
          No availability set yet
        </div>
      ) : (
        <AvailabilityList
          availability={availability}
          onEdit={setEditingId}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
