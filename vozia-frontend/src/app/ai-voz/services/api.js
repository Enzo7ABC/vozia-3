import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },

  // Analyze text
  async analyzeText(text, callId = 'DEMO_' + Date.now()) {
    try {
      const response = await api.post('/analizar-texto', {
        text,
        call_id: callId,
      })
      return response.data
    } catch (error) {
      console.error('Text analysis failed:', error)
      throw error
    }
  },

  // Analyze complete call
  async analyzeCall(transcript, callId = 'DEMO_' + Date.now(), agentId = 'DEMO_AGENT') {
    try {
      const response = await api.post('/analizar-llamada', {
        transcript,
        call_id: callId,
        agent_id: agentId,
      })
      return response.data
    } catch (error) {
      console.error('Call analysis failed:', error)
      throw error
    }
  },

  // Upload audio file
  async uploadAudio(audioFile) {
    try {
      const formData = new FormData()
      formData.append('file', audioFile)

      const response = await api.post('/subir-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Audio upload failed:', error)
      throw error
    }
  },

  // Get health status
  async getStatus() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Status check failed:', error)
      return { status: 'offline' }
    }
  },
}

export default api
