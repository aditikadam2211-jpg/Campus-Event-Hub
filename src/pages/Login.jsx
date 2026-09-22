import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'
import { useHub } from '../context/useHub'

export default function Login() {
  const [form, setForm] = useState({ role: 'student', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useHub()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(form)
      if (form.role === 'admin') navigate('/admin')
      else if (form.role === 'coordinator') navigate('/club')
      else navigate('/student')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-md mt-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black text-slate-950 text-center mb-6">Log In</h1>
      {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Role">
          <select 
            className="rounded-md border border-slate-200 px-3 py-2"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="coordinator">Club Coordinator</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Field label="Email">
          <input 
            type="email" 
            required 
            className="rounded-md border border-slate-200 px-3 py-2"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password">
          <input 
            type="password" 
            required 
            className="rounded-md border border-slate-200 px-3 py-2"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Button type="submit" className="w-full">Log In</Button>
      </form>
      <div className="mt-4 text-center text-sm text-slate-500">
        Don't have an account? <Link to="/signup" className="font-semibold text-maroon hover:underline">Sign up</Link>
      </div>
    </div>
  )
}
