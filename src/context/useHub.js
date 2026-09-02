import { useContext } from 'react'
import { HubContext } from './HubContextValue'

export function useHub() {
  const context = useContext(HubContext)
  if (!context) throw new Error('useHub must be used within HubProvider')
  return context
}
