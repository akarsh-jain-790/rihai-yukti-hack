"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface RoleRouteProps {
  children: React.ReactNode
  roles: string[]
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default RoleRoute

