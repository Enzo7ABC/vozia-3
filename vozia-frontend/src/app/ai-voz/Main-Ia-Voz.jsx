import React, { useState, useEffect, useRef } from "react";
import { FiHeadphones, FiCpu, FiZap, FiServer, FiCheck } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Header from "./components/Header";
import AnalysisResults from "./components/AnalysisResults";
import ConversationFlow from "./components/ConversationFlow";
import AudioRecorder from "./components/AudioRecorder";
import HistorialLlamadas from "./components/HistorialLlamadas";
import { apiService } from "./services/api";

import { usePageContextBridge } from "../../contexts/PageContextBridge";

// Mapea el id del modelo a colores CSS concretos (evitando clases dinámicas de Tailwind)
const MODEL_STYLE_MAP = {
  "openai":      { border: "#10b981", glow: "rgba(16,185,129,0.18)", badge: "#10b981", badgeBg: "rgba(16,185,129,0.12)", text: "#6ee7b7" },
  "gemini":      { border: "#3b82f6", glow: "rgba(59,130,246,0.18)", badge: "#3b82f6", badgeBg: "rgba(59,130,246,0.12)", text: "#93c5fd" },
  "anthropic":   { border: "#f97316", glow: "rgba(249,115,22,0.18)",  badge: "#f97316", badgeBg: "rgba(249,115,22,0.12)",  text: "#fdba74" },
  "qwen:7b":     { border: "#a855f7", glow: "rgba(168,85,247,0.18)", badge: "#a855f7", badgeBg: "rgba(168,85,247,0.12)", text: "#d8b4fe" },
  "mistral:7b":  { border: "#ef4444", glow: "rgba(239,68,68,0.18)",  badge: "#ef4444", badgeBg: "rgba(239,68,68,0.12)",  text: "#fca5a5" },
};

const DEFAULT_STYLE = { border: "#64748b", glow: "rgba(100,116,139,0.15)", badge: "#64748b", badgeBg: "rgba(100,116,139,0.1)", text: "#94a3b8" };

export default function Main_Ia_Voz() {
  const [isOnline, setIsOnline] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [textInput, setTextInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [historial, setHistorial] = useState([]);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // ── Selector de Modelos ──────────────────────────────────────────────────
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("openai");
  const [modelsLoading, setModelsLoading] = useState(true);

  const { setPageContext } = usePageContextBridge();

  // Generar session ID
  useEffect(() => {
    if (!sessionId) {
      const randomId =
        "CALL_" + Math.random().toString(36).substring(2, 9).toUpperCase();
      setSessionId(randomId);
    }
  }, [sessionId]);

  // Cargar modelos disponibles desde el backend
  useEffect(() => {
    const loadModels = async () => {
      setModelsLoading(true);
      try {
        const models = await apiService.getModels();
        setAvailableModels(models);
        if (models.length > 0) setSelectedModel(models[0].id);
      } catch (e) {
        console.error("Error cargando modelos:", e);
      } finally {
        setModelsLoading(false);
      }
    };
    loadModels();
  }, []);

  // Actualizar contexto para el Copilot
  useEffect(() => {
    const liveContext = {
      session_id: sessionId || "DEMO_001",
      page: "ia_voz",
      active_model: selectedModel,
      status: {
        isOnline,
        isLoading,
        currentStep,
      },
      analysis: analysisData
        ? {
            payload: analysisData,
          }
        : null,
      error,
    };

    setPageContext(liveContext);

    return () => {
      setPageContext(null);
    };
  }, [isOnline, isLoading, currentStep, analysisData, error, selectedModel, setPageContext]);

  // Health check inicial
  useEffect(() => {
    const runInitialCheck = async () => {
      const startTime = Date.now();
      try {
        await apiService.healthCheck();
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setInitialLoading(false);
        }, remainingTime);
      }
    };
    runInitialCheck();

    const interval = setInterval(checkBackendStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Cargar historial de llamadas desde localStorage al inicio
  useEffect(() => {
    const historialGuardado = localStorage.getItem("vozia_historial");
    if (historialGuardado) {
      try {
        setHistorial(JSON.parse(historialGuardado));
      } catch (e) {
        console.error("Error al cargar historial:", e);
      }
    }
  }, []);

  const checkBackendStatus = async () => {
    try {
      await apiService.healthCheck();
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  };

  const handleAnalyze = async (autoText = null, isFinal = true) => {
    const textToProcess = autoText && typeof autoText === 'string' ? autoText : textInput;
    if (!textToProcess.trim()) return;

    if (isFinal) {
      setIsLoading(true);
      setError(null);
      setCurrentStep(2);
    }

    try {
      const result = await apiService.getCallState(
        textToProcess,
        sessionId || "DEMO_001",
        selectedModel,
        isFinal
      );

      console.log("🔥 BACKEND RESPONSE:", result);
      console.log("🔥 CALL STATE:", result.call_state);

      setAnalysisData(result.call_state);

      if (isFinal) {
        // Procesar e integrar la nueva llamada en el historial
        const callStateObj = result.call_state || {};
        const analisis = callStateObj.analisis || {};
        const resultado = callStateObj.resultado || {};
        const audioOriginal = callStateObj.audio_original || {};

        const nuevaLlamada = {
          id: Date.now().toString(),
          fecha: new Date().toISOString(),
          resumen: resultado.resumen || "Análisis completado.",
          satisfaccion: analisis.satisfaccion || 0,
          modeloUsado: selectedModel,
          metricasPromedio: {
            angustia: analisis.angustia || 0,
            urgencia: analisis.urgencia || 0,
            interes: analisis.interes || 0,
            satisfaccion: analisis.satisfaccion || 0
          },
          textoCompleto: audioOriginal.content || textToProcess,
          huboAlerta: (analisis.urgencia > 90 || analisis.angustia > 90 || (callStateObj.accion && callStateObj.accion.recomendada && callStateObj.accion.recomendada.toUpperCase().includes('SUPERVISOR'))),
          timeline: callStateObj.timeline || []
        };

        setHistorial(prev => {
          const nuevo = [nuevaLlamada, ...prev].slice(0, 10);
          localStorage.setItem("vozia_historial", JSON.stringify(nuevo));
          return nuevo;
        });

        setCurrentStep(5);
      }
    } catch (err) {
      if (isFinal) {
        setError(err.message || "Error al conectar con el backend");
        setCurrentStep(1);
      }
    } finally {
      if (isFinal) {
        setIsLoading(false);
      }
    }
  };

  const textInputRef = useRef(textInput);
  useEffect(() => {
    textInputRef.current = textInput;
  }, [textInput]);

  // ── POLLING TIEMPO REAL ────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        const currentText = textInputRef.current;
        if (currentText.trim().length > 10) {
          handleAnalyze(currentText, false);
        }
      }, 3500); // Actualiza cada 3.5 segundos sin recargar UI
    }
    return () => clearInterval(interval);
  }, [isRecording, selectedModel, sessionId]);

  const handleReset = () => {
    setTextInput("");
    setAnalysisData(null);
    setError(null);
    setCurrentStep(1);
    const randomId =
      "CALL_" + Math.random().toString(36).substring(2, 9).toUpperCase();
    setSessionId(randomId);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center font-sans antialiased">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-slate-400 animate-pulse font-sans">
          Conectando con el motor cognitivo de IA Voz...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans antialiased">
      {/* Margen superior para compensar la barra eliminada */}
      <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-8">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── PANEL DE CONTROL DE IA ────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0B0F17]/80 backdrop-blur-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <FiCpu size={16} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Motor de Inteligencia Artificial</h3>
              <p className="text-[11px] text-slate-500">Seleccioná el modelo que analizará las llamadas. Los locales no requieren API Key.</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {availableModels.length} modelos disponibles
            </div>
          </div>

          {modelsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {availableModels.map((model) => {
                const style = MODEL_STYLE_MAP[model.id] || DEFAULT_STYLE;
                const isSelected = selectedModel === model.id;
                const isLocal = model.provider === "ollama";

                return (
                  <button
                    key={model.id}
                    id={`model-card-${model.id.replace(":", "-")}`}
                    onClick={() => setSelectedModel(model.id)}
                    style={{
                      borderColor: isSelected ? style.border : "rgba(255,255,255,0.07)",
                      boxShadow: isSelected ? `0 0 18px ${style.glow}, inset 0 0 12px ${style.glow}` : "none",
                      background: isSelected
                        ? `linear-gradient(135deg, rgba(0,0,0,0.6), ${style.glow})`
                        : "rgba(255,255,255,0.03)",
                      transition: "all 0.25s ease",
                    }}
                    className="relative text-left rounded-xl border p-3.5 flex flex-col gap-1.5 hover:border-white/20 hover:bg-white/5 group"
                  >
                    {/* Icono + Tipo */}
                    <div className="flex items-center justify-between mb-0.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: style.badgeBg }}
                      >
                        {isLocal
                          ? <FiServer size={13} style={{ color: style.text }} />
                          : <FiZap size={13} style={{ color: style.text }} />
                        }
                      </div>
                      {isSelected && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: style.border }}
                        >
                          <FiCheck size={11} className="text-black" />
                        </span>
                      )}
                    </div>

                    {/* Nombre */}
                    <p
                      className="text-[11px] font-semibold leading-tight"
                      style={{ color: isSelected ? style.text : "#94a3b8" }}
                    >
                      {model.name.split(" (")[0]}
                    </p>

                    {/* Badge proveedor */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                        style={{
                          color: style.badge,
                          background: style.badgeBg,
                          border: `1px solid ${style.badge}44`,
                        }}
                      >
                        {isLocal ? "🖥 Local" : "☁ Cloud"}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">{model.latency}</span>
                    </div>

                    {/* Descripción en hover */}
                    <p className="text-[9px] text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-500 transition-colors">
                      {model.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Indicador del modelo activo */}
          {!modelsLoading && selectedModel && (() => {
            const active = availableModels.find(m => m.id === selectedModel);
            const style = MODEL_STYLE_MAP[selectedModel] || DEFAULT_STYLE;
            if (!active) return null;
            return (
              <div
                className="mt-3 flex items-center gap-2 text-[11px] font-mono px-3 py-2 rounded-lg border"
                style={{ borderColor: `${style.border}33`, background: `${style.glow}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: style.border }} />
                <span style={{ color: style.text }}>Activo:</span>
                <span className="text-slate-300">{active.name}</span>
                <span className="ml-auto text-slate-600">ctx: {active.tokens}</span>
              </div>
            );
          })()}
        </div>
        {/* ── FIN PANEL DE CONTROL DE IA ───────────────────────────────── */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna del Flow del Copiloto */}
          <div className="col-span-1 lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-[#0B0F17]/60 backdrop-blur-xl p-4 lg:p-5">
              <ConversationFlow currentStep={currentStep} />
            </div>
          </div>

          {/* Columna Principal - Adaptable sin scroll forzado */}
          <div className="lg:col-span-9">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <FiHeadphones size={22} className="text-cyan-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        Simulación de Audio de Llamada
                      </h2>
                      <p className="text-sm text-slate-400">
                        Simula el audio de una llamada usando tus auriculares o
                        sube un archivo grabado.
                      </p>
                    </div>
                  </div>

                  {/* Entrada de Audio - Dos opciones side-by-side */}
                  <AudioRecorder
                    textInput={textInput}
                    setTextInput={setTextInput}
                    isTranscribing={isTranscribing}
                    setIsTranscribing={setIsTranscribing}
                    transcribeError={transcribeError}
                    setTranscribeError={setTranscribeError}
                    fileName={fileName}
                    setFileName={setFileName}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    sessionId={sessionId}
                    handleAnalyze={handleAnalyze}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Transcripción del Audio (Editable)
                    </label>
                    <div className="relative">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        disabled={isTranscribing}
                        placeholder={
                          isTranscribing
                            ? "Mejorando transcripción con Whisper IA..."
                            : "La transcripción del audio aparecerá aquí... También puedes escribir tu propio texto manualmente."
                        }
                        className={`
                          w-full
                          min-h-[160px]
                          rounded-2xl
                          border
                          p-5
                          text-slate-100
                          resize-none
                          outline-none
                          transition-all duration-500
                          ${
                            isTranscribing
                              ? "bg-slate-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse"
                              : "bg-slate-950/60 border-white/10 focus:border-cyan-400/50"
                          }
                        `}
                      />
                      {isTranscribing && (
                        <div className="absolute top-4 right-4 flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/95 border border-cyan-500/30 rounded-xl shadow-lg">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                          </span>
                          <span className="text-[10px] font-semibold text-cyan-300 tracking-wider uppercase font-mono animate-pulse">
                            {fileName === "microfono_grabacion.webm"
                              ? "Optimizando con IA"
                              : "Procesando Audio"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gráfico en Vivo (Live Stream) */}
                  {analysisData && analysisData.timeline && analysisData.timeline.length > 0 && (
                    <div className="h-64 w-full bg-slate-900/60 rounded-xl p-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] mt-4 animate-fadeIn">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Evolución Emocional de la Llamada en Vivo
                        </h4>
                      </div>
                      <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={analysisData.timeline.map(t => ({
                          name: `${t.segundo}s`,
                          Satisfaccion: t.satisfaccion,
                          Angustia: t.angustia,
                          Urgencia: t.urgencia,
                          Interes: t.interes
                        }))} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickMargin={5} />
                          <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '12px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                          <Line type="monotone" dataKey="Satisfaccion" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Angustia" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Urgencia" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Interes" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={
                      isLoading ||
                      isTranscribing ||
                      isRecording ||
                      !textInput.trim()
                    }
                    className="
                      h-12
                      rounded-xl
                      bg-cyan-500
                      font-semibold
                      transition-all
                      hover:bg-cyan-400
                      disabled:opacity-50
                    "
                  >
                    Procesar Texto
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Procesando llamada...
                  </h3>
                  <p className="text-xs text-slate-500 animate-pulse font-sans">
                    Analizando con{" "}
                    <span className="text-cyan-400 font-semibold">
                      {availableModels.find(m => m.id === selectedModel)?.name || selectedModel}
                    </span>
                    ...
                  </p>
                </div>
              )}

              {currentStep >= 3 && (
                <div className="space-y-4">
                  {/* Resultados estilizados reales */}
                  <AnalysisResults data={analysisData} />

                  <button
                    onClick={handleReset}
                    className="
                      h-11
                      px-6
                      rounded-xl
                      bg-slate-800
                      hover:bg-slate-700
                      transition-all
                    "
                  >
                    Nueva prueba
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Llamadas encapsulado y estilizado */}
        <div className="mt-8">
          <HistorialLlamadas llamadas={historial} />
        </div>
      </div>
    </div>
  );
}
