import { Navigate, Outlet } from 'react-router-dom'
import { getSession } from '../api/session'

export default function ProtectedRoute() {
  if (!getSession()) return <Navigate to="/" replace />
  return <Outlet />
}
