import { Link } from 'react-router-dom'
import { statusClass } from '../utils/format'

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-maroon text-white hover:opacity-90',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  }
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function LinkButton({ children, to, variant = 'primary', className = '' }) {
  const styles = {
    primary: 'bg-maroon text-white hover:opacity-90',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300',
  }
  return (
    <Link className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`} to={to}>
      {children}
    </Link>
  )
}

export function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      {detail ? <p className="mt-1 text-sm text-slate-500">{detail}</p> : null}
    </div>
  )
}

export function Badge({ children, status }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}>{children}</span>
}

export function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  )
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
