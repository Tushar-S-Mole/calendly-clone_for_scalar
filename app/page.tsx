"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-24 pb-20 text-center">
        <h1 className="text-5xl font-semibold text-gray-900 tracking-tight">
          Scheduling made simple
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Eliminate back-and-forth emails. Share your availability and let others
          book time with you instantly.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/admin/event-types"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Get started
          </Link>

          <Link
            href="/admin/meetings"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            View meetings
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Event types"
            description="Create booking links with custom durations, buffers, and availability."
            href="/admin/event-types"
            cta="Manage event types"
          />

          <FeatureCard
            title="Availability"
            description="Set weekly schedules so meetings are booked only when you’re free."
            href="/admin/availability"
            cta="Set availability"
          />

          <FeatureCard
            title="Meetings"
            description="View upcoming and past meetings, cancellations, and details."
            href="/admin/meetings"
            cta="View meetings"
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  href,
  cta,
}: {
  title: string
  description: string
  href: string
  cta: string
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">
          {cta} →
        </span>
      </div>
    </Link>
  )
}
