
import { Badge, EmptyState, LinkButton, StatCard } from '../components/ui'
import { useHub } from '../context/useHub'
import { clubName, formatDate } from '../utils/format'

export default function StudentDashboard() {
  const { events, registrations, profile, clubs } = useHub()
  const mine = registrations
    .filter((item) => item.userId === profile.id)
    .map((registration) => ({ registration, event: events.find((event) => event.id === registration.eventId) }))
    .filter((item) => item.event)

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="My registrations" value={mine.length} detail="Across campus events" />
        <StatCard label="Checked in" value={mine.filter((item) => item.registration.status === 'checked-in').length} detail="Attendance confirmed" />
        <StatCard label="Upcoming passes" value={mine.filter((item) => new Date(item.event.startTime) > new Date()).length} detail="Ready to scan" />
      </section>
      <section className="grid gap-4">
        <h1 className="text-2xl font-black text-slate-950">My Registrations</h1>
        {mine.length === 0 ? (
          <EmptyState title="No registrations yet" body="Register for an approved event to see QR passes here." action={<LinkButton to="/">Browse Events</LinkButton>} />
        ) : (
          mine.map(({ registration, event }) => (
            <article className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]" key={registration.id}>
              <div>
                <Badge status={registration.status}>{registration.status}</Badge>
                <h2 className="mt-3 text-xl font-bold text-slate-950">{event.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{clubName(clubs, event.clubId)} · {formatDate(event.startTime)} · {event.venue}</p>
                <p className="mt-4 text-sm text-slate-600">Registered on {formatDate(registration.createdAt)}</p>
              </div>
          
            </article>
          ))
        )}
      </section>
    </div>
  )
}
