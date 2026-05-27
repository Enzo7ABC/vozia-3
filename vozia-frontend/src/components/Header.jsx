import React from 'react'
import { FiMic, FiZap } from 'react-icons/fi'

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <FiZap className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VozIA
        </h1>
      </div>
      
      <p className="text-xl text-gray-700 mb-2">
        Análisis Inteligente de Emociones en Conversaciones
      </p>
      
      <p className="text-gray-600 max-w-2xl mx-auto">
        Convierte tu voz en insights valiosos. Nuestro sistema analiza emociones, 
        detecta urgencias y proporciona recomendaciones en tiempo real.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-full text-sm text-blue-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Transcripción en tiempo real
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-full text-sm text-purple-700">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Detección de emociones
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-full text-sm text-green-700">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Análisis inteligente
        </div>
      </div>
    </div>
  )
}
