"use client"

import { useEffect, useState } from "react"

interface TimeSlotsProps {
  slug: string
  date: Date
  onSlotSelect: (time: string) => void
  onBack: () => void
}

export default function TimeSlots({ slug, date, onSlotSelect, onBack }: TimeSlotsProps) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlots()
  }, [slug, date])

  const loadSlots = async () => {
    try {
      setLoading(true)
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/slots?slug=${slug}&date=${dateString}`)
      const data = await response.json()
      setSlots(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load slots:", error)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-blue-600 hover:underline mb-6">
        ← Back
      </button>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a time</h2>
      <p className="text-gray-600 mb-6">
        {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading available times...</div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No available times</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => onSlotSelect(slot)}
              className="px-4 py-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-sm font-medium text-gray-900"
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
