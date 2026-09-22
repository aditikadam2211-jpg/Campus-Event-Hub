import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'
import { useHub } from '../context/useHub'

export default function Signup() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', year: '', interests: '', club: '' })
  const [error, setError] = useState('')
  const { signup } = useHub()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      }
      if (role === 'student') {
        payload.department = form.department
        payload.year = form.year
        payload.interests = form.interests.split(',').map(i => i.trim()).filter(Boolean)
      } else if (role === 'coordinator') {
        payload.club = form.club
      }
      
      await signup(payload)
      if (role === 'coordinator') navigate('/club')
      else navigate('/student')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-md mt-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black text-slate-950 text-center mb-6">Sign Up</h1>
      {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="I am a">
          <select 
            className="rounded-md border border-slate-200 px-3 py-2"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="coordinator">Club Coordinator</option>
          </select>
        </Field>
        
        <Field label="Name">
          <input type="text" required className="rounded-md border border-slate-200 px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </Field>
        
        <Field label="College Email">
          <input type="email" required className="rounded-md border border-slate-200 px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </Field>
        
        <Field label="Password">
          <input type="password" required className="rounded-md border border-slate-200 px-3 py-2" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </Field>

        {role === 'student' && (
          <>
            <Field label="Department">
              <input type="text" required className="rounded-md border border-slate-200 px-3 py-2" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            </Field>
            <Field label="Year">
              <input type="text" required className="rounded-md border border-slate-200 px-3 py-2" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </Field>
            <Field label="Interests (comma separated)">
              <input type="text" className="rounded-md border border-slate-200 px-3 py-2" value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
            </Field>
          </>
        )}

        {role === 'coordinator' && (
          <Field label="Club Name">
            <input type="text" required className="rounded-md border border-slate-200 px-3 py-2" value={form.club} onChange={e => setForm({ ...form, club: e.target.value })} />
          </Field>
        )}

        <Button type="submit" className="w-full">Create Account</Button>
      </form>
      <div className="mt-4 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="font-semibold text-maroon hover:underline">Log in</Link>
      </div>
    </div>
  )
}
