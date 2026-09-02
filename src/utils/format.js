export function clubName(clubs, clubId) {
  return clubs.find((club) => club.id === clubId)?.name || 'Campus Club'
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function dateInputValue(value) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

export function statusClass(status) {
  return {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    registered: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'checked-in': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[status] || 'bg-slate-50 text-slate-700 border-slate-200'
}

export function metrics(events, registrations) {
  const approved = events.filter((event) => event.status === 'approved')
  const checkedIn = registrations.filter((registration) => registration.status === 'checked-in')
  return {
    events: events.length,
    approved: approved.length,
    pending: events.filter((event) => event.status === 'pending').length,
    registrations: registrations.length,
    checkIns: checkedIn.length,
    fillRate: approved.length
      ? Math.round((approved.reduce((sum, event) => sum + event.seatsFilled / event.seatLimit, 0) / approved.length) * 100)
      : 0,
  }
}
