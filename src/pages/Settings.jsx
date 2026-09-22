import { useState } from 'react'
import { Button, Field } from '../components/ui'
import { useHub } from '../context/useHub'

export default function Settings() {
  const hub = useHub()
  const [profile, setProfile] = useState(hub.profile)
  const [saved, setSaved] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const interests = profile.interests 
      ? String(profile.interests).split(',').map((item) => item.trim()).filter(Boolean)
      : []
    await hub.updateProfile({ ...profile, interests })
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-black text-slate-950">Profile & Settings</h1>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
          <Field label="Email"><input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department"><input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.department || ''} onChange={(e) => setProfile({ ...profile, department: e.target.value })} /></Field>
          <Field label="Year"><input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.year || ''} onChange={(e) => setProfile({ ...profile, year: e.target.value })} /></Field>
        </div>
        <Field label="Interests"><input className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.interests ? (Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests) : ''} onChange={(e) => setProfile({ ...profile, interests: e.target.value })} /></Field>
        <Field label="Notification preference">
          <select className="rounded-md border border-slate-200 px-3 py-2 font-normal" value={profile.notifications || 'Email and in-app'} onChange={(e) => setProfile({ ...profile, notifications: e.target.value })}>
            <option>Email and in-app</option>
            <option>In-app only</option>
            <option>Email only</option>
          </select>
        </Field>
        <div className="flex items-center gap-3">
          <Button>Save Settings</Button>
          {saved ? <span className="text-sm font-semibold text-emerald-700">Saved</span> : null}
        </div>
      </form>
    </section>
  )
}
