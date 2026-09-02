import { Badge, Button, StatCard } from '../components/ui'
import { useHub } from '../context/useHub'
import { clubName, formatDate, metrics } from '../utils/format'

export default function AdminDashboard() {
  const hub = useHub()
  const stats = metrics(hub.events, hub.registrations)
  const pending = hub.events.filter((event) => event.status === 'pending')

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label="Events" value={stats.events} detail="All statuses" />
        <StatCard label="Pending" value={stats.pending} detail="Need review" />
        <StatCard label="Registrations" value={stats.registrations} detail="Live sign-ups" />
        <StatCard label="Check-ins" value={stats.checkIns} detail="Venue attendance" />
        <StatCard label="Avg fill" value={`${stats.fillRate}%`} detail="Approved events" />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel title="Approval Queue">
          {pending.length ? pending.map((event) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4" key={event.id}>
              <h3 className="font-bold text-slate-950">{event.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{clubName(hub.clubs, event.clubId)} · {formatDate(event.startTime)} · {event.venue}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => hub.updateEventStatus(event.id, 'approved')}>Approve</Button>
                <Button variant="danger" onClick={() => hub.updateEventStatus(event.id, 'rejected')}>Reject</Button>
              </div>
            </article>
          )) : <p className="rounded-lg bg-white p-4 text-sm text-slate-500">No events waiting for review.</p>}
        </Panel>
        <Panel title="Live Registrations & Check-ins">
          {hub.registrations.map((registration) => {
            const event = hub.events.find((item) => item.id === registration.eventId)
            return (
              <article className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4" key={registration.id}>
                <div>
                  <h3 className="font-bold text-slate-950">{event?.title}</h3>
                  <p className="text-sm text-slate-500">{registration.qrToken}</p>
                </div>
                <Badge status={registration.status}>{registration.status}</Badge>
              </article>
            )
          })}
        </Panel>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Attendee Export Preview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr><th className="py-2">Event</th><th>Token</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody>
              {hub.registrations.map((registration) => (
                <tr className="border-b border-slate-100" key={registration.id}>
                  <td className="py-3 font-semibold">{hub.events.find((event) => event.id === registration.eventId)?.title}</td>
                  <td>{registration.qrToken}</td>
                  <td>{registration.status}</td>
                  <td>{formatDate(registration.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Panel({ title, children }) {
  return <section className="grid content-start gap-3"><h2 className="text-xl font-black text-slate-950">{title}</h2>{children}</section>
}
