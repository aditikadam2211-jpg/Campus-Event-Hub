import { Link } from 'react-router-dom'
import { Badge } from './ui'
import { clubName, formatDate } from '../utils/format'

export default function EventCard({ event, clubs }) {
  const seatsLeft = event.seatLimit - event.seatsFilled
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img className="h-44 w-full object-cover" src={event.image} alt="" />
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge status={event.status}>{event.status}</Badge>
          <span className="text-xs font-semibold text-slate-500">{event.category}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-950">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {clubName(clubs, event.clubId)} · {event.venue}
          </p>
          <p className="mt-2 text-sm text-slate-600">{formatDate(event.startTime)}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">{seatsLeft} seats left</span>
          <Link className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" to={`/events/${event.id}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
