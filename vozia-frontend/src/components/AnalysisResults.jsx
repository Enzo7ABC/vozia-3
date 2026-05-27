import React from 'react'
import { FiArrowLeft, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiBarChart2 } from 'react-icons/fi'
import EmotionBadge from './EmotionBadge'
import MetricCard from './MetricCard'

export default function AnalysisResults({ data, onReset }) {
  const getEmotionIcon = (emotion) => {
    const icons = {
      'ENOJO': '😠',
      'ALIVIO': '😊',
      'CONFUSION': '😕',
      'ANSIEDAD': '😰',
      'NEUTRAL': '😐'
    }
    return icons[emotion] || '😶'
  }

  const getStressColor = (level) => {
    const colors = {
      'NORMAL': 'bg-green-100 text-green-800 border-green-300',
      'MODERADO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'CRITICO': 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[level] || 'bg-gray-100'
  }

  const getInterestColor = (level) => {
    const colors = {
      'ALTO': 'bg-green-100 text-green-800',
      'MEDIO': 'bg-yellow-100 text-yellow-800',
      'BAJO': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100'
  }

  const getPrimaryEmotion = (data) => {
    if (data.emotion_analysis) {
      return data.emotion_analysis.primary_emotion
    }
    return 'NEUTRAL'
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        <FiArrowLeft size={18} />
        Iniciar Nueva Conversación
      </button>

      {/* Main Emotion Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <p className="text-sm font-semibold opacity-90 mb-2">EMOCIÓN DETECTADA</p>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">
              {getPrimaryEmotion(data)}
            </h2>
            <p className="text-blue-100">
              Confianza: {Math.round((data.emotion_analysis?.confidence || 0) * 100)}%
            </p>
          </div>
          <div className="text-6xl">{getEmotionIcon(getPrimaryEmotion(data))}</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="Nivel de Estrés"
          value={data.stress_level}
          icon={<FiAlertCircle size={20} />}
          className={getStressColor(data.stress_level)}
        />
        <MetricCard
          label="Nivel de Interés"
          value={data.interest_level}
          icon={<FiTrendingUp size={20} />}
          className={getInterestColor(data.interest_level)}
        />
        <MetricCard
          label="Urgencia"
          value={data.urgency_level}
          icon={<FiBarChart2 size={20} />}
          className="bg-orange-100 text-orange-800"
        />
        <MetricCard
          label="Satisfacción"
          value={`${Math.round((data.satisfaction || 0) * 100)}%`}
          icon={<FiCheckCircle size={20} />}
          className={`${data.satisfaction > 0.7 ? 'bg-green-100 text-green-800' : data.satisfaction > 0.4 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
        />
      </div>

      {/* Transcript */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiBarChart2 size={20} />
          Transcripción Analizada
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            {data.transcript || data.analyzed_text || 'No hay transcripción disponible'}
          </p>
        </div>
      </div>

      {/* Detected Topics */}
      {data.topics && data.topics.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Temas Detectados</h3>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Emotions */}
      {data.emotion_analysis?.secondary_emotions && data.emotion_analysis.secondary_emotions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Emociones Secundarias Detectadas</h3>
          <div className="flex flex-wrap gap-2">
            {data.emotion_analysis.secondary_emotions.map((emotion, idx) => {
              const emotionStr = typeof emotion === 'string' ? emotion : emotion.emotion || emotion.name || 'NEUTRAL'
              return <EmotionBadge key={idx} emotion={emotionStr} />
            })}
          </div>
        </div>
      )}

      {/* Recommendation */}
      {data.recommendation && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
            <FiCheckCircle size={20} />
            Recomendación para el Agente
          </h3>
          <p className="text-green-700">
            {typeof data.recommendation === 'string' ? data.recommendation : data.recommendation.action || JSON.stringify(data.recommendation)}
          </p>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen del Análisis</h3>
          <div className="space-y-3">
            {typeof data.summary === 'string' ? (
              <p className="text-gray-700">{data.summary}</p>
            ) : (
              <ul className="space-y-2">
                {Array.isArray(data.summary) && data.summary.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-blue-500 font-bold mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <FiArrowLeft size={18} />
          Nueva Conversación
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Imprimir Análisis
        </button>
      </div>
    </div>
  )
}
