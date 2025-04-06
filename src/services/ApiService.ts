// src/services/apiService.ts
import axios from 'axios'
import useAuthStore from '../store/authStore'
import { isTokenExpired } from '../utils/tokenUtils'

const BASE_URL = 'https://ifako.onrender.com/api/'
const API_KEY = 'your_api_key_here' // Replace with actual API key

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
})

apiClient.interceptors.request.use((config) => {
  const { token, logout } = useAuthStore.getState()

  if (token) {
    if (isTokenExpired(token)) {
      logout()
      throw new axios.Cancel('Session expired. Logged out.')
    }

    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

// Generic request handler with error handling
const handleRequest = async (request: Promise<any>) => {
  try {
    const response = await request
    return response.data.data
  } catch (error: any) {
    console.error('API Request Error:', error)

    if (error.response) {
      throw new Error(
        error.response.data.message || `Error: ${error.response.status}`
      )
    } else if (error.request) {
      throw new Error('Network error: No response from server')
    } else {
      throw new Error('Request failed: ' + error.message)
    }
  }
}

// API service with all CRUD functions
export const apiService = {
  get: (endpoint: string) => handleRequest(apiClient.get(endpoint)), // Fetch all
  getById: (endpoint: string, id: string) =>
    handleRequest(apiClient.get(`${endpoint}/${id}`)), // Fetch by ID
  // apiService.ts
  post: (endpoint: string, body: object | FormData) =>
    handleRequest(
      apiClient.post(endpoint, body, {
        headers:
          body instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : undefined,
      })
    ),

  update: (endpoint: string, id: string, body: object) =>
    handleRequest(apiClient.put(`${endpoint}/${id}`, body)), // Update
  delete: (fullPath: string) => handleRequest(apiClient.delete(fullPath)),
}
