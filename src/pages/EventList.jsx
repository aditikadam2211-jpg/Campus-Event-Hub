import { useMemo, useState } from 'react'
import EventCard from '../components/EventCard'
import { useHub } from '../context/useHub'

export default function EventList() {
  const { events, clubs } = useHub()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [club, setClub] = useState('All')
  const categories = ['All', ...new Set(events.map((event) => event.category))]
  const visible = useMemo(
    () =>
      events.filter((event) => {
        const q = query.toLowerCase()
        return (
          event.status === 'approved' &&
          (category === 'All' || event.category === category) &&
          (club === 'All' || event.clubId === club) &&
          [event.title, event.venue, event.category].join(' ').toLowerCase().includes(q)
        )
      }),
    [events, query, category, club],
  )

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Student discovery</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black sm:text-5xl">  One place for every event happening at Pillai College.</h1>
        <p className="mt-4 max-w-2xl text-slate-300"> Discover campus events, explore clubs, check seat availability, register instantly, and access your QR pass—all in one place.</p>
      </section>
      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_220px]">
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Search by title, venue or category" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" value={club} onChange={(event) => setClub(event.target.value)}>
          <option>All</option>
          {clubs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((event) => <EventCard event={event} clubs={clubs} key={event.id} />)}
      </div>
    </div>
  )
}
