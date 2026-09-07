import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { HubProvider } from './context/HubContext'
import { useHub } from './context/useHub'
import AppLayout from './layouts/AppLayout'
import AdminDashboard from './pages/AdminDashboard'
import ClubDashboard from './pages/ClubDashboard'
import Confirmation from './pages/Confirmation'
import EventDetails from './pages/EventDetails'
import EventList from './pages/EventList'
import Settings from './pages/Settings'
import StudentDashboard from './pages/StudentDashboard'

function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useHub()
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <HubProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<EventList />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="confirmation/:eventId" element={<Confirmation />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="club" element={<ProtectedRoute allowedRoles={['coordinator', 'admin']}><ClubDashboard /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HubProvider>
  )
}
