"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Calendar from "@/components/booking/calendar"
import TimeSlots from "@/components/booking/time-slots"
import BookingForm from "@/components/booking/booking-form"

interface EventType {
  id: string
  name: string
  duration: number
  slug: string
}

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [eventType, setEventType] = useState<EventType | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<"calendar" | "time" | "form">("calendar")

  useEffect(() => {
    fetchEventType()
  }, [slug])

  const fetchEventType = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/event-types?slug=${slug}`)
      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        setEventType(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch event type:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!eventType) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Booking Details */}
          <div className="md:col-span-1 border-r border-gray-200 pr-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{eventType.name}</h1>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">{eventType.duration}</span> minutes
              </div>
              {selectedDate && (
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {selectedTime && <p className="font-medium text-gray-900">{selectedTime}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            {step === "calendar" && (
              <Calendar
                slug={slug}
                onDateSelect={(date) => {
                  setSelectedDate(date)
                  setStep("time")
                }}
              />
            )}

            {step === "time" && selectedDate && (
              <TimeSlots
                slug={slug}
                date={selectedDate}
                onSlotSelect={(time) => {
                  setSelectedTime(time)
                  setStep("form")
                }}
                onBack={() => setStep("calendar")}
              />
            )}

            {step === "form" && selectedDate && selectedTime && (
              <BookingForm
                slug={slug}
                eventName={eventType.name}
                date={selectedDate}
                time={selectedTime}
                duration={eventType.duration}
                onSuccess={() => setStep("calendar")}
                onBack={() => setStep("time")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
