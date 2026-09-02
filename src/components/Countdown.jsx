import { useEffect, useState } from 'react'

function parts(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ target }) {
  const [time, setTime] = useState(() => parts(target))

  useEffect(() => {
    const timer = setInterval(() => setTime(parts(target)), 1000)
    return () => clearInterval(timer)
  }, [target])

  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(time).map(([label, value]) => (
        <div className="rounded-md bg-slate-950 px-3 py-3 text-center text-white" key={label}>
          <div className="text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-300">{label}</div>
        </div>
      ))}
    </div>
  )
}
