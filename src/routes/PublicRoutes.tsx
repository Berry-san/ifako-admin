// components/routing/PublicOnlyRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  console.log(isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default PublicOnlyRoute
