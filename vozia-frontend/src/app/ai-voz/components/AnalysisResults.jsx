import React from 'react'
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiBarChart2, FiMessageSquare, FiSliders } from 'react-icons/fi'

export default function AnalysisResults({ data }) {
  if (!data) return null

  // Extracción limpia según tu estructura real
  const analisis = data.analisis || {}
  const resultado = data.resultado || {}
  const accion = data.accion || {}
  const audioOriginal = data.audio_original || {}

  // Lógica de colores dinámica para la emoción principal detectada
  const getEmotionStyles = (emotion) => {
    const emo = String(emotion).toLowerCase()
    if (emo.includes('frustr') || emo.includes('enojo') || emo.includes('ira')) {
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
    if (emo.includes('ansied') || emo.includes('angustia') || emo.includes('urgente')) {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  }

  return (
    <div className="space-y-5 font-sans text-slate-200 antialiased">
      
      {/* 1. Encabezado de Control Operativo */}
      <div className="relative p-5 border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase block mb-1">
            Métrica Emocional Central
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
              {analisis.emocion_principal || 'Indeterminada'}
            </h2>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getEmotionStyles(analisis.emocion_principal)}`}>
              Estado Crítico
            </span>
          </div>
        </div>

        {/* Badge de Auditoría en Vivo */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-medium tracking-wide text-slate-300">Análisis NLP</span>
        </div>
      </div>

      {/* 2. Matriz de Variables Cuantitativas (0 a 100) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Urgencia */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wide">Urgencia Operativa</span>
            <FiBarChart2 size={14} className="text-amber-400" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-bold text-white font-mono">
              {analisis.urgencia ?? 0}%
            </span>
            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div 
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-500" 
                style={{ width: `${analisis.urgency_level || analisis.urgencia || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Angustia / Estrés */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wide">Nivel de Angustia</span>
            <FiAlertCircle size={14} className="text-rose-400" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-bold text-white font-mono">
              {analisis.angustia ?? 0}%
            </span>
            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${analisis.angustia || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Compromiso / Interés */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wide">Nivel de Interés</span>
            <FiTrendingUp size={14} className="text-blue-400" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-bold text-white font-mono">
              {analisis.interes ?? 0}%
            </span>
            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${analisis.interes || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Satisfacción */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium tracking-wide">Satisfacción de Usuario</span>
            <FiCheckCircle size={14} className="text-emerald-400" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className={`text-lg font-bold font-mono ${analisis.satisfaccion > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {analisis.satisfaccion ?? 0}%
            </span>
            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div 
                className={`h-full transition-all duration-500 ${analisis.satisfaccion > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                style={{ width: `${analisis.satisfaccion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Transcripción Capturada */}
      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <FiMessageSquare size={13} className="text-blue-400" />
          Texto Original de Entrada
        </h3>
        <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 italic">
          "{audioOriginal.content || 'Sin transcripción registrada.'}"
        </p>
      </div>

      {/* 4. Resumen Ejecutivo y Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        
        {/* Resumen */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] md:col-span-8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resumen de Intenciones</h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {resultado.resumen || 'No se generó resumen operativo para este payload.'}
          </p>
        </div>

        {/* Palabras Clave */}
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] md:col-span-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Palabras Clave</h4>
          <div className="flex flex-wrap gap-1.5">
            {resultado.palabras_clave && resultado.palabras_clave.length > 0 ? (
              resultado.palabras_clave.map((keyword, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 rounded tracking-wide uppercase">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Ninguna detectada</span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Acción Sugerida: Copiloto / Consola de Decisión Directa */}
      {accion.recomendada && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
            <FiSliders size={13} />
            Acción Inmediata Sugerida (Copilot)
          </h3>
          <p className="text-xs md:text-sm font-semibold text-slate-100 leading-relaxed">
            {accion.recomendada}
          </p>
        </div>
      )}

    </div>
  )
}