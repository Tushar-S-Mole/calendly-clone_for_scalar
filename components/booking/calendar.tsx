"use client"

import { useEffect, useState } from "react"

interface CalendarProps {
  slug: string
  onDateSelect: (date: Date) => void
}

export default function Calendar({ slug, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableDates()
  }, [currentDate, slug])

  const loadAvailableDates = async () => {
    setLoading(true)
    const dates = new Set<string>()

    // Check next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() + i)

      const dateString = date.toISOString().split("T")[0]

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/slots?slug=${slug}&date=${dateString}`,
        )
        const slots = await response.json()
        if (Array.isArray(slots) && slots.length > 0) {
          dates.add(dateString)
        }
      } catch (error) {
        console.error("Failed to check availability:", error)
      }
    }

    setAvailableDates(dates)
    setLoading(false)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect(selectedDate)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a date</h2>

      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={handleNextMonth} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const dateString = date.toISOString().split("T")[0]
          const isAvailable = availableDates.has(dateString)
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable || isPast}
              className={`
                aspect-square flex items-center justify-center rounded font-medium text-sm transition
                ${
                  isAvailable && !isPast
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer border border-blue-200"
                    : "text-gray-400 bg-gray-50 cursor-not-allowed"
                }
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
