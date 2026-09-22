import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HubProvider } from './context/HubContext'
import { useHub } from './context/useHub'
import AppLayout from './layouts/AppLayout'
import AdminDashboard from './pages/AdminDashboard'
import ClubDashboard from './pages/ClubDashboard'
import Confirmation from './pages/Confirmation'
import EventDetails from './pages/EventDetails'
import EventList from './pages/EventList'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'

function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useHub()
  
  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <HubProvider>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<EventList />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="confirmation/:eventId" element={<Confirmation />} />
            <Route path="student" element={<ProtectedRoute allowedRoles={['student', 'admin']}><StudentDashboard /></ProtectedRoute>} />
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
