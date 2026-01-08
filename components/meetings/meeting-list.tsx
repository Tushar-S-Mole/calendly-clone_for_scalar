"use client"

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

interface MeetingListProps {
  meetings: Meeting[]
  onCancel: (id: string) => void
}

export default function MeetingList({ meetings, onCancel }: MeetingListProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{meeting.inviteeName}</h3>
              <p className="text-sm text-gray-600">{meeting.inviteeEmail}</p>
            </div>
            <button
              onClick={() => onCancel(meeting.id)}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Event Type</p>
              <p className="font-medium text-gray-900">{meeting.eventType.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Start</p>
              <p className="font-medium text-gray-900">{formatDateTime(meeting.startTime)}</p>
            </div>
            <div>
              <p className="text-gray-600">End</p>
              <p className="font-medium text-gray-900">{formatDateTime(meeting.endTime)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
