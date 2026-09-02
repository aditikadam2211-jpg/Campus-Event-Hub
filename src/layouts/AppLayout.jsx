import { NavLink, Outlet } from 'react-router-dom'
import { useHub } from '../context/useHub'

const links = [
  ['/', 'Events'],
  ['/student', 'Student'],
  ['/club', 'Club'],
  ['/admin', 'Admin'],
  ['/scanner', 'Scanner'],
  ['/settings', 'Settings'],
]

export default function AppLayout() {
  const { role, setRole } = useHub()
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-black text-white">CEH</span>
            <span>
              <span className="block text-base font-bold text-slate-950">Campus Event Hub</span>
              <span className="block text-xs text-slate-500">Club events and student registration</span>
            </span>
          </NavLink>
          <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1">
            {links.map(([to, label]) => (
              <NavLink className={({ isActive }) => `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`} key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
          <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="student">Student view</option>
            <option value="coordinator">Club coordinator</option>
            <option value="admin">Admin view</option>
          </select>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
