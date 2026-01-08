"use client"

interface EventType {
  id: string
  name: string
  duration: number
  slug: string
  bufferBefore: number
  bufferAfter: number
}

interface EventTypeListProps {
  eventTypes: EventType[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function EventTypeList({ eventTypes, onEdit, onDelete }: EventTypeListProps) {
  return (
    <div className="space-y-4">
      {eventTypes.map((eventType) => (
        <div key={eventType.id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{eventType.name}</h3>
              <p className="text-sm text-gray-600">/event/{eventType.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(eventType.id)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(eventType.id)}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-medium text-gray-900">{eventType.duration} min</p>
            </div>
            <div>
              <p className="text-gray-600">Buffer Before</p>
              <p className="font-medium text-gray-900">{eventType.bufferBefore} min</p>
            </div>
            <div>
              <p className="text-gray-600">Buffer After</p>
              <p className="font-medium text-gray-900">{eventType.bufferAfter} min</p>
            </div>
            <div>
              <p className="text-gray-600">Booking Link</p>
              <a href={`/event/${eventType.slug}`} className="font-medium text-blue-600 hover:underline">
                View
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
