import axios from "axios"
import { getToken } from "./authService"

const API_URL = "http://localhost:5000/api"

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers["x-auth-token"] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error)
      return Promise.reject(new Error("Network error. Please check your connection."))
    }

    // Handle API errors
    const { status, data } = error.response

    if (status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized:", data)
      // You might want to redirect to login page or refresh token here
    }

    return Promise.reject(error)
  },
)

export const caseService = {
  // Get all cases
  getAllCases: async () => {
    try {
      const response = await api.get("/cases")
      return response.data
    } catch (error) {
      console.error("Error fetching cases:", error)
      throw error
    }
  },

  // Get case by ID
  getCaseById: async (id: string) => {
    try {
      const response = await api.get(`/cases/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching case ${id}:`, error)
      throw error
    }
  },

  // Create new case
  createCase: async (caseData: any) => {
    try {
      const response = await api.post("/cases", caseData)
      return response.data
    } catch (error) {
      console.error("Error creating case:", error)
      throw error
    }
  },

  // Update case
  updateCase: async (id: string, caseData: any) => {
    try {
      const response = await api.put(`/cases/${id}`, caseData)
      return response.data
    } catch (error) {
      console.error(`Error updating case ${id}:`, error)
      throw error
    }
  },

  // Delete case
  deleteCase: async (id: string) => {
    try {
      const response = await api.delete(`/cases/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting case ${id}:`, error)
      throw error
    }
  },

  // Get cases by user ID
  getCasesByUserId: async (userId: string) => {
    try {
      const response = await api.get(`/cases/user/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching cases for user ${userId}:`, error)
      throw error
    }
  },

  // Get cases by status
  getCasesByStatus: async (status: string) => {
    try {
      const response = await api.get(`/cases/status/${status}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching cases with status ${status}:`, error)
      throw error
    }
  },

  // Mock function for development/testing
  getMockCase: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data
    return {
      id,
      title: "State vs. John Doe",
      caseNumber: "CR-2023-" + id,
      court: "District Court, Delhi",
      judge: "Hon. Justice Sharma",
      filingDate: "2023-01-15",
      nextHearingDate: "2023-06-20",
      applicant: "John Doe",
      respondent: "State",
      charges: ["Section 302 - Murder", "Section 120B - Criminal Conspiracy"],
      description: "Case involving alleged murder and conspiracy charges against the defendant.",
      status: "Pending",
      hearings: [
        {
          date: "2023-02-10",
          time: "10:30 AM",
          type: "Bail Hearing",
          notes: "Defendant's counsel presented arguments for bail consideration.",
        },
        {
          date: "2023-03-15",
          time: "11:00 AM",
          type: "Evidence Presentation",
          notes: "Prosecution presented initial evidence and witness testimonies.",
        },
      ],
      documents: [
        {
          name: "Charge Sheet.pdf",
          date: "2023-01-20",
          url: "#",
        },
        {
          name: "Bail Application.pdf",
          date: "2023-02-05",
          url: "#",
        },
      ],
      lawyer: {
        name: "Adv. Rajesh Kumar",
        barCouncilNumber: "DEL/12345/2010",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@legalfirm.com",
      },
    }
  },
}

export const riskAssessmentService = {
  // Get risk assessment by case ID
  getRiskAssessment: async (caseId: string) => {
    try {
      const response = await api.get(`/risk-assessment/${caseId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching risk assessment for case ${caseId}:`, error)
      throw error
    }
  },

  // Create risk assessment
  createRiskAssessment: async (assessmentData: any) => {
    try {
      const response = await api.post("/risk-assessment", assessmentData)
      return response.data
    } catch (error) {
      console.error("Error creating risk assessment:", error)
      throw error
    }
  },

  // Update risk assessment
  updateRiskAssessment: async (id: string, assessmentData: any) => {
    try {
      const response = await api.put(`/risk-assessment/${id}`, assessmentData)
      return response.data
    } catch (error) {
      console.error(`Error updating risk assessment ${id}:`, error)
      throw error
    }
  },

  // Mock function for development/testing
  getMockRiskAssessment: async (caseId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data
    return {
      caseId,
      score: 65,
      level: "Medium",
      factors: [
        "Previous criminal history",
        "Severity of current charges",
        "Community ties are moderate",
        "Employment status is stable",
      ],
    }
  },
}

