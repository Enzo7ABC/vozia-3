import React from 'react'
import { FiMic, FiZap, FiBarChart2, FiCheckCircle } from 'react-icons/fi'

export default function ConversationFlow({ currentStep }) {
  const steps = [
    {
      id: 1,
      title: 'Grabar/Escribir',
      description: 'Inicia una conversación',
      icon: <FiMic size={24} />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Analizar',
      description: 'Procesando audio...',
      icon: <FiZap size={24} />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Resultados',
      description: 'Análisis completado',
      icon: <FiBarChart2 size={24} />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      title: 'Acción',
      description: 'Usar insights',
      icon: <FiCheckCircle size={24} />,
      color: 'from-emerald-500 to-emerald-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Flujo de Conversación
      </h3>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`absolute left-6 top-16 w-1 h-6 ${isCompleted || isActive ? 'bg-gradient-to-b from-blue-500 to-blue-200' : 'bg-gray-300'}`}></div>
              )}

              {/* Step Card */}
              <div
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon Circle */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${step.color} shadow-lg scale-110`
                        : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={`font-bold ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-600'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                        Ahora
                      </div>
                    </div>
                  )}
                </div>

                {/* Animation for Active Step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse opacity-25"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Progreso</span>
          <span className="text-xs font-bold text-blue-600">{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700">
          <span className="font-bold">💡 Tip:</span> El sistema analiza automáticamente emociones, urgencias y proporciona recomendaciones basadas en la transcripción.
        </p>
      </div>
    </div>
  )
}
