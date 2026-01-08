"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface EventTypeFormProps {
  onSave: () => void
  editingId?: string | null
  onCancel: () => void
}

export default function EventTypeForm({ onSave, editingId, onCancel }: EventTypeFormProps) {
  const [form, setForm] = useState({
    name: "",
    duration: 30,
    slug: "",
    bufferBefore: 0,
    bufferAfter: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingId) {
      fetchEventType()
    }
  }, [editingId])

  // ✅ FIX: correct API URL
  const fetchEventType = async () => {
    try {
      const response = await fetch(`/api/event-types/${editingId}`)
      if (!response.ok) return
      const data = await response.json()
      setForm(data)
    } catch (error) {
      console.error("Failed to fetch event type:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId
        ? `/api/event-types/${editingId}`
        : `/api/event-types`

      // ✅ FIX: correct API URL
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text)
      }

      await response.json()
      onSave()
    } catch (error: any) {
      setError(error.message || "Failed to save event type")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: Number(e.target.value) })
            }
            min="15"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value.toLowerCase() })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buffer Before (min)
          </label>
          <input
            type="number"
            value={form.bufferBefore}
            onChange={(e) =>
              setForm({ ...form, bufferBefore: Number(e.target.value) })
            }
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buffer After (min)
          </label>
          <input
            type="number"
            value={form.bufferAfter}
            onChange={(e) =>
              setForm({ ...form, bufferAfter: Number(e.target.value) })
            }
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Create"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
