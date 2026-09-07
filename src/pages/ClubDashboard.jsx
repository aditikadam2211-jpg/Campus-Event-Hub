import { useState } from 'react'
import { Badge, Button, Field, StatCard } from '../components/ui'
import { useHub } from '../context/useHub'
import { clubName, dateInputValue, formatDate, metrics } from '../utils/format'

const blank = {
  title: '',
  clubId: 'club-tech',
  category: 'Technology',
  venue: '',
  startTime: dateInputValue('2026-09-30T10:00:00+05:30'),
  endTime: dateInputValue('2026-09-30T12:00:00+05:30'),
  seatLimit: 80,
  seatsFilled: 0,
  status: 'pending',
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  description: '',
  highlights: ['Student led', 'Open registration'],
}

export default function ClubDashboard() {
  const hub = useHub()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const stats = metrics(hub.events, hub.registrations)

  function edit(event) {
    setEditing(event.id)
    setForm({ ...event, startTime: dateInputValue(event.startTime), endTime: dateInputValue(event.endTime) })
  }

  async function submit(event) {
    event.preventDefault()
    await hub.saveEvent({ ...form, id: editing, highlights: String(form.highlights).split(',').map((item) => item.trim()).filter(Boolean) })
    setEditing(null)
    setForm(blank)
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Club events" value={stats.events} detail="Drafted and published" />
        <StatCard label="Approved" value={stats.approved} detail="Visible to students" />
        <StatCard label="Pending" value={stats.pending} detail="Awaiting admin" />
        <StatCard label="Registrations" value={stats.registrations} detail="Total sign-ups" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
          <h1 className="text-2xl font-black text-slate-950">{editing ? 'Edit Event' : 'Create Event'}</h1>
          <Field label="Title">
            <input required className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Club">
              <select className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.clubId} onChange={(e) => setForm({ ...form, clubId: e.target.value })}>
                {hub.clubs.map((club) => <option value={club.id} key={club.id}>{club.name}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Field>
          </div>
          <Field label="Venue">
            <input required className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start">
              <input type="datetime-local" className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </Field>
            <Field label="Seat limit">
              <input type="number" min="1" className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.seatLimit} onChange={(e) => setForm({ ...form, seatLimit: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea required className="min-h-24 rounded-md border border-slate-200 px-3 py-2 font-normal" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Event Image">
            <input type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const objectUrl = URL.createObjectURL(e.target.files[0])
                setForm({ ...form, image: objectUrl })
              }
            }} />
            {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 w-full rounded-md object-cover" />}
          </Field>
          <Field label="Highlights, comma separated">
            <input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={Array.isArray(form.highlights) ? form.highlights.join(', ') : form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Save Changes' : 'Create Event'}</Button>
            {editing ? <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(blank) }}>Cancel</Button> : null}
          </div>
        </form>
        <div className="grid gap-3">
          <h2 className="text-2xl font-black text-slate-950">Manage Events</h2>
          {hub.events.map((event) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={event.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge status={event.status}>{event.status}</Badge>
                  <h3 className="mt-2 font-bold text-slate-950">{event.title}</h3>
                  <p className="text-sm text-slate-500">{clubName(hub.clubs, event.clubId)} · {formatDate(event.startTime)}</p>
                  <p className="mt-1 text-sm text-slate-600">{event.seatsFilled}/{event.seatLimit} registered</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => edit(event)}>Edit</Button>
                  <Button variant="danger" onClick={() => hub.deleteEvent(event.id)}>Delete</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
