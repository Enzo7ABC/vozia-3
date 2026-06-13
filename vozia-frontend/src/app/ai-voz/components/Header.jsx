import React from 'react'
import { FiZap } from 'react-icons/fi'

export default function Header() {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
      
      {/* Título e Isologo */}
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/10">
          <FiZap className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            VozIA <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase ml-1.5 px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">Copilot</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Análisis Cognitivo y Mapeo de Emociones en Tiempo Real
          </p>
        </div>
      </div>

      {/* Badges de Estado del Sistema */}
      <div className="flex flex-wrap gap-2 md:justify-end items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-medium text-slate-300">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
          Whisper Stream
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-medium text-slate-300">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
          NLP Emotion Engine
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-medium text-slate-300">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Core Operativo
        </div>
      </div>

    </div>
  )
}