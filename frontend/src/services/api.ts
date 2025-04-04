import axios from "axios"

const API_URL = "http://localhost:6000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log(email, password);
      const response = await api.post("/auth/login", { email, password })
      console.log(response);

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
    const response = await api.get("/cases")
    return response.data
  },

  getCaseById: async (id: string) => {
    const response = await api.get(`/cases/${id}`)
    return response.data
  },

  createCase: async (caseData: any) => {
    const response = await api.post("/cases", caseData)
    return response.data
  },

  updateCase: async (id: string, caseData: any) => {
    const response = await api.put(`/cases/${id}`, caseData)
    return response.data
  },

  getCaseHistory: async (id: string) => {
    const response = await api.get(`/cases/${id}/history`)
    return response.data
  },
}

// Hearing services
export const hearingService = {
  getAllHearings: async () => {
    const response = await api.get("/hearings")
    return response.data
  },

  getHearingById: async (id: string) => {
    const response = await api.get(`/hearings/${id}`)
    return response.data
  },

  createHearing: async (hearingData: any) => {
    const response = await api.post("/hearings", hearingData)
    return response.data
  },

  updateHearing: async (id: string, hearingData: any) => {
    const response = await api.put(`/hearings/${id}`, hearingData)
    return response.data
  },
}

// Judge specific services
export const judgeService = {
  getCalendar: async () => {
    const response = await api.get("/cases/judge/calendar")
    return response.data
  },

  getTodayCases: async () => {
    const response = await api.get("/cases/judge/today")
    return response.data
  },
}

// Risk assessment services
export const riskAssessmentService = {
  getRiskAssessment: async (caseId: string) => {
    const response = await api.get(`/risk-assessment/${caseId}`)
    return response.data
  },

  calculateRiskAssessment: async (caseId: string) => {
    const response = await api.get(`/risk-assessment/calculate/${caseId}`)
    return response.data
  },

  saveRiskAssessment: async (caseId: string, assessmentData: any) => {
    const response = await api.post(`/risk-assessment/${caseId}`, assessmentData)
    return response.data
  },
}

export default api

