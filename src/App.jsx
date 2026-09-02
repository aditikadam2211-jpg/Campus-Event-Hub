import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HubProvider } from './context/HubContext'
import AppLayout from './layouts/AppLayout'
import AdminDashboard from './pages/AdminDashboard'
import ClubDashboard from './pages/ClubDashboard'
import Confirmation from './pages/Confirmation'
import EventDetails from './pages/EventDetails'
import EventList from './pages/EventList'
import Scanner from './pages/Scanner'
import Settings from './pages/Settings'
import StudentDashboard from './pages/StudentDashboard'

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
            <Route path="club" element={<ClubDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="scanner" element={<Scanner />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HubProvider>
  )
}
