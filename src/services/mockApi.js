import { clubs as seedClubs, currentUser, events as seedEvents, registrations as seedRegistrations } from '../data/mockData'
import { loadState, saveState } from './storage'

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 120))

const initialState = {
  events: seedEvents,
  registrations: seedRegistrations,
  profile: currentUser,
  clubs: seedClubs,
}

export function getInitialHubState() {
  return loadState('state', initialState)
}

export function persistHubState(state) {
  saveState('state', state)
}

export const api = {
  getSnapshot() {
    return delay(getInitialHubState())
  },
  registerForEvent(state, eventId) {
    const exists = state.registrations.find((item) => item.userId === state.profile.id && item.eventId === eventId)
    if (exists) return delay({ ...state, lastRegistration: exists })
    const registration = {
      id: `reg-${Date.now()}`,
      userId: state.profile.id,
      eventId,
      qrToken: `CEH-${state.profile.id}-${eventId}-${Date.now()}`,
      status: 'registered',
      createdAt: new Date().toISOString(),
      checkedInAt: null,
    }
    const next = {
      ...state,
      registrations: [registration, ...state.registrations],
      events: state.events.map((event) =>
        event.id === eventId ? { ...event, seatsFilled: Math.min(event.seatLimit, event.seatsFilled + 1) } : event,
      ),
      lastRegistration: registration,
    }
    persistHubState(next)
    return delay(next)
  },
  saveEvent(state, event) {
    const isEdit = Boolean(event.id)
    const payload = {
      ...event,
      id: event.id || `event-${Date.now()}`,
      seatLimit: Number(event.seatLimit),
      seatsFilled: Number(event.seatsFilled || 0),
      status: event.status || 'pending',
    }
    const next = {
      ...state,
      events: isEdit ? state.events.map((item) => (item.id === payload.id ? payload : item)) : [payload, ...state.events],
    }
    persistHubState(next)
    return delay(next)
  },
  deleteEvent(state, eventId) {
    const next = {
      ...state,
      events: state.events.filter((event) => event.id !== eventId),
      registrations: state.registrations.filter((registration) => registration.eventId !== eventId),
    }
    persistHubState(next)
    return delay(next)
  },
  updateEventStatus(state, eventId, status) {
    const next = { ...state, events: state.events.map((event) => (event.id === eventId ? { ...event, status } : event)) }
    persistHubState(next)
    return delay(next)
  },
  checkIn(state, token) {
    let result = { ok: false, message: 'No registration found for that QR token.' }
    const registrations = state.registrations.map((registration) => {
      if (registration.qrToken !== token) return registration
      if (registration.status === 'checked-in') {
        result = { ok: true, message: 'Already checked in.', registration }
        return registration
      }
      const updated = { ...registration, status: 'checked-in', checkedInAt: new Date().toISOString() }
      result = { ok: true, message: 'Check-in confirmed.', registration: updated }
      return updated
    })
    const next = { ...state, registrations }
    persistHubState(next)
    return delay({ next, result })
  },
  updateProfile(state, profile) {
    const next = { ...state, profile }
    persistHubState(next)
    return delay(next)
  },
}
