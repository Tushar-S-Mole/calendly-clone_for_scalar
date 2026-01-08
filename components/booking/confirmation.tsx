"use client"

import Link from "next/link"

interface ConfirmationProps {
  booking: {
    id: string
    inviteeName: string
    inviteeEmail: string
    startTime: string
    endTime: string
  }
  eventName: string
}

export default function Confirmation({ booking, eventName }: ConfirmationProps) {
  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)

  return (
    <div className="max-w-lg">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-green-900 mb-2">Booking Confirmed!</h2>
        <p className="text-green-800">A confirmation has been sent to {booking.inviteeEmail}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">Event</p>
          <p className="text-lg font-semibold text-gray-900">{eventName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">Guest Name</p>
          <p className="text-lg font-semibold text-gray-900">{booking.inviteeName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">Guest Email</p>
          <p className="text-lg font-semibold text-gray-900">{booking.inviteeEmail}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium">Date & Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {startTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} -{" "}
            {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="block mt-6 text-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}
