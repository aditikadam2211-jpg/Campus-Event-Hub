import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useHub } from '../context/useHub'
import { Button } from '../components/ui'

const baseLinks = [
  { to: '/', label: 'Events', roles: ['student', 'coordinator', 'admin'] },
  { to: '/student', label: 'Student', roles: ['student', 'coordinator', 'admin'] },
  { to: '/club', label: 'Club', roles: ['coordinator', 'admin'] },
  { to: '/admin', label: 'Admin', roles: ['admin'] },
  { to: '/settings', label: 'Settings', roles: ['student', 'coordinator', 'admin'] },
]

export default function AppLayout() {
  const { role, profile, logout } = useHub()
  const navigate = useNavigate()
  
  const visibleLinks = baseLinks.filter((link) => link.roles.includes(role))
  
  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-maroon text-sm font-black text-white">CEH</span>
            <span>
              <span className="block text-base font-bold text-slate-950">Campus Event Hub</span>
              <span className="block text-xs text-slate-500">Club events and student registration</span>
            </span>
          </NavLink>
          <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1">
            {visibleLinks.map(({ to, label }) => (
              <NavLink className={({ isActive }) => `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-white text-maroon shadow-sm' : 'text-slate-600 hover:text-maroon'}`} key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-950">{profile?.name}</div>
              <div className="text-xs text-slate-500 capitalize">{role}</div>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
