"use client"

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface AvailabilityListProps {
  availability: Availability[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function AvailabilityList({ availability, onEdit, onDelete }: AvailabilityListProps) {
  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm">
        <div>Day</div>
        <div>Start Time</div>
        <div>End Time</div>
        <div>Actions</div>
      </div>

      {availability.map((slot) => (
        <div key={slot.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 items-center">
          <div className="font-medium text-gray-900">{dayNames[slot.dayOfWeek]}</div>
          <div className="text-gray-700">{slot.startTime}</div>
          <div className="text-gray-700">{slot.endTime}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(slot.id)}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
