import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Countdown from '../components/Countdown'
import QRCode from '../components/QRCode'
import { Button, LinkButton } from '../components/ui'
import { useHub } from '../context/useHub'
import { clubName, formatDate } from '../utils/format'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hub = useHub()
  const event = hub.events.find((item) => item.id === id)
  if (!event) return <Navigate to="/" replace />
  const registration = hub.registrations.find((item) => item.userId === hub.profile.id && item.eventId === event.id)
  const seatsLeft = event.seatLimit - event.seatsFilled

  async function register() {
    await hub.registerForEvent(event.id)
    navigate(`/confirmation/${event.id}`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <img className="h-72 w-full object-cover" src={event.image} alt="" />
        <div className="p-6">
          <p className="text-sm font-semibold text-cyan-700">{clubName(hub.clubs, event.clubId)} · {event.category}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{event.title}</h1>
          <p className="mt-4 text-slate-600">{event.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Info label="Date" value={formatDate(event.startTime)} />
            <Info label="Venue" value={event.venue} />
            <Info label="Seats" value={`${seatsLeft} of ${event.seatLimit} left`} />
          </div>
          <h2 className="mt-8 text-lg font-bold text-slate-950">Highlights</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {event.highlights.map((item) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700" key={item}>{item}</span>)}
          </div>
        </div>
      </section>
      <aside className="grid content-start gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Starts In</h2>
          <div className="mt-4"><Countdown target={event.startTime} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
          {registration ? (
            <>
              <h2 className="text-lg font-bold text-slate-950">Your QR Pass</h2>
              <div className="mt-4"><QRCode token={registration.qrToken} /></div>
              <LinkButton className="mt-4 w-full" to={`/confirmation/${event.id}`}>Open Confirmation</LinkButton>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-950">Register</h2>
              <p className="mt-2 text-sm text-slate-500">One-click sign-up prevents duplicate entries and updates seat availability.</p>
              <Button className="mt-5 w-full" onClick={register} disabled={seatsLeft <= 0}>Register Now</Button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-md bg-slate-100 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
