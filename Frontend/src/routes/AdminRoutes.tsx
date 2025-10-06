import { Route, Routes } from 'react-router-dom'
import AdminLoginPage from '../pages/Admin/AdminLoginPage'
import ProtectedLogin from '../components/protectedComponents/ProtectedLogin'
import ProtectedRoute from '../components/protectedComponents/ProtectedRoute'
import Dashboard from '../pages/Admin/Dashboard'
import Users from '../pages/Admin/Users'
import Investors from '../pages/Admin/Investors'

const AdminRoutes = () => {
    return (
        <Routes>
      {/* Public route */}
      <Route path="/login" element={<ProtectedLogin><AdminLoginPage /></ProtectedLogin>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/investors" element={<ProtectedRoute><Investors /></ProtectedRoute>} />
    </Routes>
    )
}

export default AdminRoutes