import Layout from '../components/organisms/Layout'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/Dashboard'
import Members from '../pages/Members'
import News from '../pages/News'
import paths from './paths'
import ProtectedRoutes from './ProtectedRoutes'
import PublicOnlyRoutes from './PublicRoutes'
import useAuthStore from '../store/authStore'
import ReportsPage from '../pages/Reports'
import Users from '../pages/UserManagement'

function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={paths.dashboard} replace />
          ) : (
            <Navigate to={paths.login} replace />
          )
        }
      />
      <Route
        path={paths.login}
        element={
          <PublicOnlyRoutes>
            <Login />
          </PublicOnlyRoutes>
        }
      />

      <Route
        path={paths.dashboard}
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={paths.news} element={<News />} />
        <Route path={paths.members} element={<Members />} />
        <Route path={paths.report} element={<ReportsPage />} />
        <Route path={paths.users} element={<Users />} />
      </Route>
      {/* Optional catch-all route */}
      <Route
        path="*"
        element={
          <h1 className="flex items-center justify-center h-screen text-3xl font-bold">
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  )
}

export default AppRoutes
