import { useState } from 'react'
import { Badge, Button } from '../components/ui'
import { useHub } from '../context/useHub'
import { formatDate } from '../utils/format'

export default function Scanner() {
  const hub = useHub()
  const [token, setToken] = useState(hub.registrations[0]?.qrToken || '')
  const [result, setResult] = useState(null)

  async function scan(event) {
    event.preventDefault()
    setResult(await hub.checkIn(token.trim()))
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Mobile check-in tool</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">QR Scanner</h1>
        <form className="mt-6 grid gap-3" onSubmit={scan}>
          <textarea className="min-h-32 rounded-md border border-slate-200 px-3 py-2 text-sm" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste or type QR token" />
          <Button>Simulate Scan</Button>
        </form>
        {result ? <div className={`mt-4 rounded-lg p-4 text-sm font-semibold ${result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{result.message}</div> : null}
      </section>
      <section className="grid content-start gap-3">
        <h2 className="text-xl font-black text-slate-950">Recent Passes</h2>
        {hub.registrations.map((registration) => {
          const event = hub.events.find((item) => item.id === registration.eventId)
          return (
            <button className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-300" key={registration.id} onClick={() => setToken(registration.qrToken)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-950">{event?.title}</h3>
                <Badge status={registration.status}>{registration.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{registration.checkedInAt ? `Checked in ${formatDate(registration.checkedInAt)}` : registration.qrToken}</p>
            </button>
          )
        })}
      </section>
    </div>
  )
}
