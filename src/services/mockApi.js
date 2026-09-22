import {
  clubs as seedClubs,
  users as seedUsers,
  events as seedEvents,
  registrations as seedRegistrations,
} from '../data/mockData'
import { loadState, saveState } from './storage'

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120))

const initialState = {
  events: seedEvents,
  registrations: seedRegistrations,
  users: seedUsers,
  profile: null,
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

  login(state, { email, password, role }) {
    const user = state.users.find(u => u.email === email && u.password === password && u.role === role)
    if (!user) {
      throw new Error('Invalid credentials or role')
    }
    const next = { ...state, profile: user }
    persistHubState(next)
    return delay(next)
  },

  signup(state, payload) {
    const exists = state.users.find(u => u.email === payload.email)
    if (exists) {
      throw new Error('Email is already registered')
    }
    const newUser = {
      ...payload,
      id: `user-${Date.now()}`,
    }
    const next = { ...state, users: [...state.users, newUser], profile: newUser }
    persistHubState(next)
    return delay(next)
  },

  logout(state) {
    const next = { ...state, profile: null }
    persistHubState(next)
    return delay(next)
  },

  registerForEvent(state, eventId) {
    const exists = state.registrations.find(
      (item) =>
        item.userId === state.profile.id &&
        item.eventId === eventId
    )

    if (exists) {
      return delay({
        ...state,
        lastRegistration: exists,
      })
    }

    const registration = {
      id: `reg-${Date.now()}`,
      userId: state.profile.id,
      eventId,
      status: 'registered',
      createdAt: new Date().toISOString(),
      checkedInAt: null,
    }

    const next = {
      ...state,

      registrations: [
        registration,
        ...state.registrations,
      ],

      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              seatsFilled: Math.min(
                event.seatLimit,
                event.seatsFilled + 1
              ),
            }
          : event
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

      events: isEdit
        ? state.events.map((item) =>
            item.id === payload.id ? payload : item
          )
        : [payload, ...state.events],
    }

    persistHubState(next)
    return delay(next)
  },

  deleteEvent(state, eventId) {
    const next = {
      ...state,

      events: state.events.filter(
        (event) => event.id !== eventId
      ),

      registrations: state.registrations.filter(
        (registration) => registration.eventId !== eventId
      ),
    }

    persistHubState(next)
    return delay(next)
  },

  updateEventStatus(state, eventId, status) {
    const next = {
      ...state,

      events: state.events.map((event) =>
        event.id === eventId
          ? { ...event, status }
          : event
      ),
    }

    persistHubState(next)
    return delay(next)
  },

  updateProfile(state, profile) {
    const next = {
      ...state,
      profile,
    }

    persistHubState(next)
    return delay(next)
  },
}