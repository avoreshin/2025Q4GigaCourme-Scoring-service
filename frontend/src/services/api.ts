import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Startups
export const startupsApi = {
  getAll: (params?: any) => api.get('/startups/', { params }),
  getById: (id: number) => api.get(`/startups/${id}`),
  create: (data: any) => api.post('/startups/', data),
  update: (id: number, data: any) => api.put(`/startups/${id}`, data),
  delete: (id: number) => api.delete(`/startups/${id}`),
  upload: (formData: FormData) => api.post('/startups/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// Pitch Documents
export const pitchDocumentsApi = {
  getById: (id: number) => api.get(`/pitch-documents/${id}`),
  updateText: (id: number, data: any) => api.put(`/pitch-documents/${id}/text`, data),
  analyzeMissing: (id: number) => api.post(`/pitch-documents/${id}/analyze-missing`),
}

// Scorings
export const scoringsApi = {
  getAll: (params?: any) => api.get('/scorings/', { params }),
  getById: (id: number) => api.get(`/scorings/${id}`),
  create: (startupId: number) => api.post(`/scorings/startups/${startupId}/score`),
  addComment: (id: number, text: string) => api.post(`/scorings/${id}/comments`, { text }),
}

// Leaderboard
export const leaderboardApi = {
  get: (params?: any) => api.get('/leaderboard/', { params }),
}

// Export
export const exportApi = {
  pdf: (id: number) => api.get(`/scorings/${id}/export/pdf`, { responseType: 'blob' }),
  excel: (id: number) => api.get(`/scorings/${id}/export/excel`, { responseType: 'blob' }),
}

// Agents
export const agentsApi = {
  getAllConfigs: () => api.get('/agents/configs'),
  getConfig: (agentName: string) => api.get(`/agents/configs/${agentName}`),
  updateConfig: (agentName: string, data: any) => api.put(`/agents/configs/${agentName}`, data),
  resetConfig: (agentName: string) => api.post(`/agents/configs/${agentName}/reset`),
}

export default api

