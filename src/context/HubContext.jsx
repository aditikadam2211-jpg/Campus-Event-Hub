import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { HubContext } from './HubContextValue'

const TOKEN_KEY = 'campus-event-hub:token'

const initialState = {
  events: [],
  registrations: [],
  users: [],
  profile: null,
  clubs: [],
  lastRegistration: null,
}

export function HubProvider({ children }) {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(true)

  async function loadAppData() {
    try {
      const profile = await api.me()

      const [events, clubs, registrations] = await Promise.all([
        api.getEvents(),
        api.getClubs(),
        api.getRegistrations(),
      ])

      setState({
        events,
        registrations,
        users: [],
        profile,
        clubs,
        lastRegistration: null,
      })
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY)

      setState(initialState)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      loadAppData()
    } else {
      setLoading(false)
    }
  }, [])

  const actions = useMemo(
    () => ({
      login: async (credentials) => {
        const profile = await api.login(credentials)

        const [events, clubs, registrations] = await Promise.all([
          api.getEvents(),
          api.getClubs(),
          api.getRegistrations(),
        ])

        setState({
          events,
          registrations,
          users: [],
          profile,
          clubs,
          lastRegistration: null,
        })

        return profile
      },

      signup: async (payload) => {
        const profile = await api.signup(payload)

        const [events, clubs, registrations] = await Promise.all([
          api.getEvents(),
          api.getClubs(),
          api.getRegistrations(),
        ])

        setState({
          events,
          registrations,
          users: [],
          profile,
          clubs,
          lastRegistration: null,
        })

        return profile
      },

      logout: async () => {
        api.logout()
        setState(initialState)
      },

      registerForEvent: async (eventId) => {
        const registration = await api.registerForEvent(eventId)

        const [events, registrations] = await Promise.all([
          api.getEvents(),
          api.getRegistrations(),
        ])

        setState((current) => ({
          ...current,
          events,
          registrations,
          lastRegistration: registration,
        }))

        return registration
      },

      saveEvent: async (event) => {
        const formData = new FormData()

        Object.entries(event).forEach(([key, value]) => {
          if (value === undefined || value === null) return

          if (key === 'highlights' && Array.isArray(value)) {
            formData.append('highlights', value.join(','))
          } else if (key === 'image' && value instanceof File) {
            formData.append('image', value)
          } else {
            formData.append(key, value)
          }
        })

        const savedEvent = event.id
          ? await api.updateEvent(event.id, formData)
          : await api.createEvent(formData)

        const events = await api.getEvents()

        setState((current) => ({
          ...current,
          events,
        }))

        return savedEvent
      },

      deleteEvent: async (eventId) => {
        await api.deleteEvent(eventId)

        const [events, registrations] = await Promise.all([
          api.getEvents(),
          api.getRegistrations(),
        ])

        setState((current) => ({
          ...current,
          events,
          registrations,
        }))
      },

      updateEventStatus: async (eventId, status) => {
        await api.updateEventStatus(eventId, status)

        const events = await api.getEvents()

        setState((current) => ({
          ...current,
          events,
        }))
      },

      updateProfile: async (profile) => {
        const updatedProfile = await api.updateProfile(profile)

        setState((current) => ({
          ...current,
          profile: updatedProfile,
        }))

        return updatedProfile
      },
    }),
    [],
  )

  const role = state.profile?.role || null

  return (
    <HubContext.Provider
      value={{
        ...state,
        role,
        loading,
        ...actions,
      }}
    >
      {children}
    </HubContext.Provider>
  )
}
