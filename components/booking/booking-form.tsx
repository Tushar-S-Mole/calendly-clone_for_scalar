"use client"

import type React from "react"

import { useState } from "react"
import Confirmation from "./confirmation"

interface BookingFormProps {
  slug: string
  eventName: string
  date: Date
  time: string
  duration: number
  onSuccess: () => void
  onBack: () => void
}

export default function BookingForm({ slug, eventName, date, time, duration, onSuccess, onBack }: BookingFormProps) {
  const [form, setForm] = useState({
    inviteeName: "",
    inviteeEmail: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          inviteeName: form.inviteeName,
          inviteeEmail: form.inviteeEmail,
          date: date.toISOString().split("T")[0],
          time,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to book meeting")
      }

      const bookingData = await response.json()
      setBooking(bookingData)
      setConfirmed(true)
    } catch (error: any) {
      setError(error.message || "Failed to book meeting")
    } finally {
      setLoading(false)
    }
  }

  if (confirmed && booking) {
    return <Confirmation booking={booking} eventName={eventName} />
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-6">
        ← Back
      </button>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your details</h2>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={form.inviteeName}
            onChange={(e) => setForm({ ...form, inviteeName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={form.inviteeEmail}
            onChange={(e) => setForm({ ...form, inviteeEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  )
}
