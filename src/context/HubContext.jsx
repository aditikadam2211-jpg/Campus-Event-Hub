import { useMemo, useState } from 'react'
import { api, getInitialHubState } from '../services/mockApi'
import { HubContext } from './HubContextValue'

export function HubProvider({ children }) {
  const [state, setState] = useState(getInitialHubState)

  const actions = useMemo(
    () => ({
      login: async (credentials) => setState(await api.login(state, credentials)),
      signup: async (payload) => setState(await api.signup(state, payload)),
      logout: async () => setState(await api.logout(state)),
      registerForEvent: async (eventId) => setState(await api.registerForEvent(state, eventId)),
      saveEvent: async (event) => setState(await api.saveEvent(state, event)),
      deleteEvent: async (eventId) => setState(await api.deleteEvent(state, eventId)),
      updateEventStatus: async (eventId, status) => setState(await api.updateEventStatus(state, eventId, status)),
      updateProfile: async (profile) => setState(await api.updateProfile(state, profile)),
    }),
    [state],
  )

  const role = state.profile?.role || null;

  return <HubContext.Provider value={{ ...state, role, ...actions }}>{children}</HubContext.Provider>
}
