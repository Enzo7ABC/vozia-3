import React, { useRef, useState, useEffect } from 'react'
import { FiMic, FiUpload, FiX, FiPlay, FiLoader } from 'react-icons/fi'
import { apiService } from '../services/api'

export default function AudioRecorder({ onAudioProcessed, isLoading }) {
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)

  // Fake transcriptions for demo
  const demoTranscripts = [
    "Hola, buenos días. Llamo porque tengo un problema con mi pago. Intenté pagar mi factura hace tres días pero me dice que fue rechazado. No entiendo por qué si tengo saldo en la cuenta. Es muy frustrante porque necesitaba que se procesara urgentemente. ¿Pueden ayudarme a resolver esto de inmediato?",
    "Hola, quería consultar sobre los planes de servicio. He estado con ustedes varios años y quisiera ver si hay opciones más económicas. No estoy seguro de qué paquete me conviene. ¿Podrías explicarme las diferencias entre los planes?",
    "Excelente, ya recibí la confirmación del cambio de plan. Muchas gracias por la atención. Estoy muy satisfecho con el servicio y la rapidez para resolver todo. Definitivamente seguiré siendo cliente.",
    "Mira, esto es inaceptable. He llamado tres veces sobre el mismo problema y nadie lo ha resuelto. Estoy furioso con la calidad del servicio. Necesito hablar con un supervisor AHORA. No voy a tolerar esto más."
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []
      
      mediaRecorderRef.current = mediaRecorder
      streamRef.current = stream
      setAudioChunks([])
      setRecordingTime(0)
      setTranscript('')

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioChunks(chunks)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Verifica los permisos.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  // Enviar audio al backend para transcripción
  const handleTranscribeAudio = async () => {
    if (!audioBlob) {
      alert('No hay audio grabado')
      return
    }

    setIsTranscribing(true)
    try {
      // Crear un File a partir del Blob
      const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' })
      
      // Enviar al backend
      const response = await apiService.uploadAudio(audioFile)
      
      // Usar la transcripción del backend
      const transcribedText = response.transcript || 'No se pudo transcribir el audio'
      setTranscript(transcribedText)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      alert('Error al transcribir: ' + error.message)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleAnalyze = () => {
    if (transcript.trim()) {
      onAudioProcessed(transcript)
    }
  }

  const handleUseDemo = () => {
    const randomDemo = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)]
    setTranscript(randomDemo)
    setAudioBlob(null)
  }

  const handleClear = () => {
    setTranscript('')
    setAudioChunks([])
    setAudioBlob(null)
    setRecordingTime(0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Iniciar una Conversación
        </h2>

        {isRecording && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-900">
                  Grabando...
                </span>
              </div>
              <span className="font-mono text-lg font-bold text-blue-600">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Button Group */}
        <div className="flex gap-3 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMic size={20} />
              Iniciar Grabación
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <FiX size={20} />
              Detener Grabación
            </button>
          )}

          <button
            onClick={handleUseDemo}
            disabled={isRecording || isLoading}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            <FiUpload size={20} />
            Ver Ejemplo
          </button>
        </div>

        {/* Text Input Area */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Transcripción (editable)
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="La transcripción del audio aparecerá aquí... O copia/pega tu propio texto."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Transcription Status */}
        {audioBlob && !transcript && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-yellow-800">
                ✓ Audio grabado ({(audioBlob.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={handleTranscribeAudio}
              disabled={isTranscribing || isLoading}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {isTranscribing ? (
                <>
                  <FiLoader size={20} className="animate-spin" />
                  Transcribiendo...
                </>
              ) : (
                <>
                  <FiMic size={20} />
                  Transcribir Audio
                </>
              )}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {transcript && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !transcript.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Analizando...' : 'Analizar Conversación'}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>🎤 Opciones:</strong>
            <br />
            1. Graba → Detén → Transcribe<br />
            2. O usa "Ver Ejemplo"
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <strong>✨ Flujo:</strong>
            <br />
            Audio → Backend → Análisis de Emociones
          </p>
        </div>
      </div>
    </div>
  )
}
