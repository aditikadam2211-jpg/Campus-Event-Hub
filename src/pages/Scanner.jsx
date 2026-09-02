import { Badge } from '../components/ui'
import { useHub } from '../context/useHub'
import { formatDate } from '../utils/format'

export default function Scanner() {
  const hub = useHub()

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Event check-in
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Check-In
        </h1>

        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-bold text-slate-800">
            Check-in system coming soon
          </p>

          <p className="mt-2 text-sm text-slate-500">
            QR-based check-in will be connected when the backend and database
            are implemented.
          </p>
        </div>
      </section>

      <section className="grid content-start gap-3">
        <h2 className="text-xl font-black text-slate-950">
          Recent Registrations
        </h2>

        {hub.registrations.map((registration) => {
          const event = hub.events.find(
            (item) => item.id === registration.eventId
          )

          return (
            <div
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={registration.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-950">
                  {event?.title}
                </h3>

                <Badge status={registration.status}>
                  {registration.status}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {registration.checkedInAt
                  ? `Checked in ${formatDate(registration.checkedInAt)}`
                  : `Registered ${formatDate(registration.createdAt)}`}
              </p>
            </div>
          )
        })}
      </section>
    </div>
  )
}