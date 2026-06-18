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

  // Transcribe audio using Whisper
  async transcribeAudio(wavBlob, sessionId) {
    try {
      const formData = new FormData()
      formData.append("file", wavBlob, "audio_upload.wav")
      if (sessionId) {
        formData.append("session_id", sessionId)
      }
      const response = await api.post('/ia-voz/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Transcription failed:', error)
      const errMsg = error.response?.data?.detail || error.message || 'Error en el servidor de transcripción'
      throw new Error(errMsg)
    }
  },

  // Get cognitive call state analysis
  async getCallState(message, sessionId = "DEMO_001") {
    try {
      const response = await api.post('/ia-voz/call-state', {
        message,
        session_id: sessionId,
      })
      return response.data
    } catch (error) {
      console.error('Call state analysis failed:', error)
      const errMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Error al conectar con el backend'
      throw new Error(errMsg)
    }
  },
}

export default api
