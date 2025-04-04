import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["x-auth-token"] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message)
      return Promise.reject({
        response: {
          data: {
            msg: "Network error. Please check your internet connection.",
          },
        },
      })
    }

    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Only redirect if not already on login page to avoid redirect loops
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login"
      }
    }

    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error("Server Error:", error.response)
      return Promise.reject({
        response: {
          data: {
            msg: "Server error. Please try again later.",
          },
        },
      })
    }

    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post("/auth/register", userData)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      console.error("Register API error:", error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // Redirect to login page after logout
    window.location.href = "/login"
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },

  // Add a method to fetch the current user from the API
  fetchCurrentUser: async () => {
    try {
      const response = await api.get("/auth/user")
      return response.data
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    try {
      const response = await api.put("/users/profile", userData)

      // Update stored user data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },
}

// Case services
export const caseService = {
  getAllCases: async () => {
    try {
      const response = await api.get("/cases")
      return response.data
    } catch (error) {
      console.error("Error fetching cases:", error)
      throw error
    }
  },

  getCaseById: async (id: string) => {
    try {
      const response = await api.get(`/cases/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching case ${id}:`, error)
      throw error
    }
  },

  createCase: async (caseData: any) => {
    try {
      const response = await api.post("/cases", caseData)
      return response.data
    } catch (error) {
      console.error("Error creating case:", error)
      throw error
    }
  },

  updateCase: async (id: string, caseData: any) => {
    try {
      const response = await api.put(`/cases/${id}`, caseData)
      return response.data
    } catch (error) {
      console.error(`Error updating case ${id}:`, error)
      throw error
    }
  },

  getCaseHistory: async (id: string) => {
    try {
      const response = await api.get(`/cases/${id}/history`)
      return response.data
    } catch (error) {
      console.error(`Error fetching case history for ${id}:`, error)
      throw error
    }
  },
}

// Hearing services
export const hearingService = {
  getAllHearings: async () => {
    try {
      const response = await api.get("/hearings")
      return response.data
    } catch (error) {
      console.error("Error fetching hearings:", error)
      throw error
    }
  },

  getHearingById: async (id: string) => {
    try {
      const response = await api.get(`/hearings/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching hearing ${id}:`, error)
      throw error
    }
  },

  createHearing: async (hearingData: any) => {
    try {
      const response = await api.post("/hearings", hearingData)
      return response.data
    } catch (error) {
      console.error("Error creating hearing:", error)
      throw error
    }
  },

  updateHearing: async (id: string, hearingData: any) => {
    try {
      const response = await api.put(`/hearings/${id}`, hearingData)
      return response.data
    } catch (error) {
      console.error(`Error updating hearing ${id}:`, error)
      throw error
    }
  },
}

// Judge specific services
export const judgeService = {
  getCalendar: async () => {
    try {
      const response = await api.get("/cases/judge/calendar")
      return response.data
    } catch (error) {
      console.error("Error fetching judge calendar:", error)
      throw error
    }
  },

  getTodayCases: async () => {
    try {
      const response = await api.get("/cases/judge/today")
      return response.data
    } catch (error) {
      console.error("Error fetching today's cases:", error)
      throw error
    }
  },
}

// Risk assessment services
export const riskAssessmentService = {
  getRiskAssessment: async (caseId: string) => {
    try {
      const response = await api.get(`/risk-assessment/${caseId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching risk assessment for case ${caseId}:`, error)
      throw error
    }
  },

  calculateRiskAssessment: async (caseId: string) => {
    try {
      const response = await api.get(`/risk-assessment/calculate/${caseId}`)
      return response.data
    } catch (error) {
      console.error(`Error calculating risk assessment for case ${caseId}:`, error)
      throw error
    }
  },

  saveRiskAssessment: async (caseId: string, assessmentData: any) => {
    try {
      const response = await api.post(`/risk-assessment/${caseId}`, assessmentData)
      return response.data
    } catch (error) {
      console.error(`Error saving risk assessment for case ${caseId}:`, error)
      throw error
    }
  },
}

// User services
export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/users")
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error)
      throw error
    }
  },

  getLawyers: async () => {
    try {
      const response = await api.get("/users/role/lawyers")
      return response.data
    } catch (error) {
      console.error("Error fetching lawyers:", error)
      throw error
    }
  },

  getJudges: async () => {
    try {
      const response = await api.get("/users/role/judges")
      return response.data
    } catch (error) {
      console.error("Error fetching judges:", error)
      throw error
    }
  },
}

export default api

