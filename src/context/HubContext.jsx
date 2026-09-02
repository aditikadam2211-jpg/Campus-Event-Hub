import { useMemo, useState } from 'react'
import { api, getInitialHubState } from '../services/mockApi'
import { HubContext } from './HubContextValue'

export function HubProvider({ children }) {
  const [state, setState] = useState(getInitialHubState)
  const [role, setRole] = useState('student')

  const actions = useMemo(
    () => ({
      setRole,
      registerForEvent: async (eventId) => setState(await api.registerForEvent(state, eventId)),
      saveEvent: async (event) => setState(await api.saveEvent(state, event)),
      deleteEvent: async (eventId) => setState(await api.deleteEvent(state, eventId)),
      updateEventStatus: async (eventId, status) => setState(await api.updateEventStatus(state, eventId, status)),
      checkIn: async (token) => {
        const { next, result } = await api.checkIn(state, token)
        setState(next)
        return result
      },
      updateProfile: async (profile) => setState(await api.updateProfile(state, profile)),
    }),
    [state],
  )

  return <HubContext.Provider value={{ ...state, role, ...actions }}>{children}</HubContext.Provider>
}
