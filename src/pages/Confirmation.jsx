import { Navigate, useParams } from 'react-router-dom'

import { LinkButton } from '../components/ui'
import { useHub } from '../context/useHub'
import { clubName, formatDate } from '../utils/format'

export default function Confirmation() {
  const { eventId } = useParams()
  const { events, registrations, profile, clubs } = useHub()

  const event = events.find((item) => item.id === eventId)
  const registration = registrations.find(
    (item) => item.userId === profile.id && item.eventId === eventId
  )

  if (!event || !registration) return <Navigate to="/" replace />

  return (
    <section className="mx-auto grid max-w-4xl gap-6 rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Registration confirmed
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          {event.title}
        </h1>

        <p className="mt-2 text-slate-500">
          {clubName(clubs, event.clubId)} · {formatDate(event.startTime)} · {event.venue}
        </p>
      </div>

      <p className="mx-auto max-w-xl text-sm text-slate-500">
        Your registration has been successfully confirmed. You can view your registered events from your student dashboard.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <LinkButton to="/student">
          My Registrations
        </LinkButton>
      </div>
    </section>
  )
}