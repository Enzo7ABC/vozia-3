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
  async getCallState(message, sessionId = "DEMO_001", activeModel = "openai", isFinal = true) {
    try {
      const response = await api.post('/ia-voz/call-state', {
        message,
        session_id: sessionId,
        active_model: activeModel,
        page_context: { is_final: isFinal }
      })
      return response.data
    } catch (error) {
      console.error('Call state analysis failed:', error)
      const errMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Error al conectar con el backend'
      throw new Error(errMsg)
    }
  },

  // Get available AI models
  async getModels() {
    try {
      const response = await api.get('/ia-voz/models')
      return response.data
    } catch (error) {
      console.error('Failed to fetch AI models:', error)
      // Fallback a los modelos predeterminados si falla
      return [
        {
          id: "openai",
          name: "OpenAI GPT-4 (Groq Cloud)",
          provider: "groq",
          latency: "1.2s",
          tokens: "128k",
          color: "text-emerald-400",
          description: "Modelo insignia de OpenAI procesado a través de la nube de Groq."
        },
        {
          id: "gemini",
          name: "Gemini 1.5 Pro (Groq Cloud)",
          provider: "groq",
          latency: "0.8s",
          tokens: "2m",
          color: "text-blue-400",
          description: "Modelo de Google optimizado para alta velocidad y contexto masivo."
        },
        {
          id: "anthropic",
          name: "Anthropic Claude 3.5 (Groq Cloud)",
          provider: "groq",
          latency: "1.5s",
          tokens: "200k",
          color: "text-orange-400",
          description: "Modelo premium de Anthropic con alta precisión y control analítico."
        }
      ]
    }
  },
}

export default api
