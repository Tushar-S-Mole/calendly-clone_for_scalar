import type React from "react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
          <Link href="/" className="font-semibold text-lg text-gray-900">
            Calendly Clone
          </Link>
          <div className="flex gap-6">
            <Link href="/admin/event-types" className="text-gray-600 hover:text-gray-900 transition">
              Event Types
            </Link>
            <Link href="/admin/availability" className="text-gray-600 hover:text-gray-900 transition">
              Availability
            </Link>
            <Link href="/admin/meetings" className="text-gray-600 hover:text-gray-900 transition">
              Meetings
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
