import React, { useState, useEffect } from 'react'
import { FiMic, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Header from './components/Header'
import AudioRecorder from './components/AudioRecorder'
import AnalysisResults from './components/AnalysisResults'
import ConversationFlow from './components/ConversationFlow'
import { apiService } from './services/api'

export default function App() {
  const [isOnline, setIsOnline] = useState(true)
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Recording, 2: Analyzing, 3: Results

  useEffect(() => {
    // Check backend status
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendStatus = async () => {
    try {
      await apiService.healthCheck()
      setIsOnline(true)
    } catch {
      setIsOnline(false)
    }
  }

  const handleAudioProcessed = async (audioText) => {
    setIsLoading(true)
    setError(null)
    setCurrentStep(2)

    try {
      const result = await apiService.analyzeCall(
        audioText,
        'DEMO_' + Date.now(),
        'DEMO_AGENT'
      )
      
      setAnalysisData(result)
      setCurrentStep(3)
    } catch (err) {
      setError(err.message || 'Error al analizar el audio')
      setCurrentStep(1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnalysisData(null)
    setError(null)
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Status Banner */}
      <div className={`w-full px-4 py-3 ${isOnline ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          {isOnline ? (
            <>
              <FiCheckCircle className="text-green-600" size={18} />
              <span className="text-sm text-green-800">Backend conectado</span>
            </>
          ) : (
            <>
              <FiAlertCircle className="text-red-600" size={18} />
              <span className="text-sm text-red-800">
                Sin conexión con el backend. Usando datos de demostración.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left: Progress Steps */}
          <div className="lg:col-span-1">
            <ConversationFlow currentStep={currentStep} />
          </div>

          {/* Right: Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <AudioRecorder 
                onAudioProcessed={handleAudioProcessed}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse"></div>
                      <div className="absolute inset-2 rounded-full bg-blue-500 flex items-center justify-center">
                        <FiMic className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Analizando...
                </h3>
                <p className="text-gray-600">
                  Estamos procesando el audio y analizando las emociones
                </p>
              </div>
            )}

            {currentStep === 3 && analysisData && (
              <AnalysisResults 
                data={analysisData}
                onReset={handleReset}
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>VozIA v0.1.0 - Sistema de Análisis Inteligente de Emociones</p>
          <p className="mt-1">Fase de demostración - Sin persistencia de datos</p>
        </div>
      </footer>
    </div>
  )
}
