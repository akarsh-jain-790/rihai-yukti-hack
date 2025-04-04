"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/api"
import { useToast } from "../components/ui/toaster"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "lawyer" | "user" | "judge" | "researcher"
  barCouncilNumber?: string
  courtId?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setLoading(true)
        const currentUser = authService.getCurrentUser()

        if (currentUser) {
          // Verify token is still valid by fetching current user from API
          try {
            await authService.fetchCurrentUser()
            setUser(currentUser)
            setIsAuthenticated(true)
          } catch (err) {
            // Token is invalid or expired
            console.error("Token validation error:", err)
            authService.logout()
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const clearError = () => {
    setError(null)
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // Make the API call to login
      const data = await authService.login(email, password)

      // Set user data and authentication state
      setUser(data.user)
      setIsAuthenticated(true)

      // Store token and user data in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      return data
    } catch (err: any) {
      console.error("Authentication error:", err)
      const errorMessage = err.response?.data?.msg || "Login failed. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setLoading(true)
      setError(null)

      // Make the API call to register
      const data = await authService.register(userData)

      // Set user data and authentication state
      setUser(data.user)
      setIsAuthenticated(true)

      // Store token and user data in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      return data
    } catch (err: any) {
      console.error("Registration error:", err)
      const errorMessage = err.response?.data?.msg || "Registration failed. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      addToast({
        title: "Logged Out",
        description: "You have been successfully logged out",
        type: "success",
      })
    } catch (err) {
      console.error("Logout error:", err)
      addToast({
        title: "Error",
        description: "There was a problem logging out",
        type: "error",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

