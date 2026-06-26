import React, { useState, useEffect, useRef } from "react";
import { Bot, Zap, Server } from "lucide-react";
import ChatCopilotInput from "../copilot/ChatCopilotInput";
import ChatCopilotMessage from "../copilot/ChatCopilotMessage";

import { useChatCopilotContext } from "../../contexts/ChatCopilotContext";
import { usePageContextBridge } from "../../contexts/PageContextBridge";

// Mapa de estilos por modelo — coherente con Main-Ia-Voz
const MODEL_STYLE_MAP = {
  "openai":      { border: "border-emerald-500", text: "text-emerald-400",  activeBg: "bg-emerald-500/10", abbr: "OAI"  },
  "gemini":      { border: "border-blue-500",    text: "text-blue-400",     activeBg: "bg-blue-500/10",    abbr: "GEM"  },
  "anthropic":   { border: "border-orange-500",  text: "text-orange-400",   activeBg: "bg-orange-500/10",  abbr: "ANT"  },
  "qwen:7b":     { border: "border-purple-500",  text: "text-purple-400",   activeBg: "bg-purple-500/10",  abbr: "QWN"  },
  "mistral:7b":  { border: "border-red-500",     text: "text-red-400",      activeBg: "bg-red-500/10",     abbr: "MST"  },
};
const DEFAULT_STYLE = { border: "border-slate-600", text: "text-slate-400", activeBg: "bg-slate-800", abbr: "AI" };

export default function ChatCopilot({
  copilotOpen,
  setCopilotOpen,
  copilotWidth,
  setCopilotWidth,
}) {
  const { input, setInput, loading, messages, handleSend } =
    useChatCopilotContext();
  const { pageContext } = usePageContextBridge();

  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("openai");
  const [isSwitching, setIsSwitching] = useState(false);
  const [showModelsMobile, setShowModelsMobile] = useState(false);

  const bubbleRef = useRef(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Cargar modelos dinámicamente desde el backend
  useEffect(() => {
    const loadModels = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/ia-voz/models`);
        if (res.ok) {
          const data = await res.json();
          setAvailableModels(data);
          if (data.length > 0 && !pageContext?.active_model) {
            setSelectedModel(data[0].id);
          }
        }
      } catch (e) {
        console.error("Error cargando modelos en copilot:", e);
        setAvailableModels([
          { id: "openai",     name: "OpenAI GPT-4",  provider: "groq",   latency: "1.2s", tokens: "128k" },
          { id: "qwen:7b",    name: "Qwen 7B",        provider: "ollama", latency: "0.5s", tokens: "32k" },
          { id: "mistral:7b", name: "Mistral 7B",     provider: "ollama", latency: "0.6s", tokens: "32k" },
        ]);
      }
    };
    loadModels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar con el selector de modelo del panel principal
  useEffect(() => {
    if (pageContext?.active_model && pageContext.active_model !== selectedModel) {
      setSelectedModel(pageContext.active_model);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageContext?.active_model]);

  // ── Drag handlers (mobile) ──────────────────────────────────────────────
  const handleDragStart = (clientX, clientY) => {
    if (window.innerWidth >= 1024) return;
    draggingRef.current = true;
    const rect = bubbleRef.current.getBoundingClientRect();
    offsetRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    bubbleRef.current.style.transition = "none";
  };

  const handleDragMove = (clientX, clientY) => {
    if (!draggingRef.current || !bubbleRef.current) return;
    requestAnimationFrame(() => {
      const el = bubbleRef.current;
      let x = clientX - offsetRef.current.x;
      let y = clientY - offsetRef.current.y;
      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      el.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      el.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
      el.style.position = "fixed";
      el.style.right = "auto";
      el.style.bottom = "auto";
    });
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
    if (bubbleRef.current) bubbleRef.current.style.transition = "all 0.3s ease";
  };

  const handleBotClick = () => {
    if (window.innerWidth < 1024) setShowModelsMobile(!showModelsMobile);
    else setCopilotOpen(true);
  };

  const handleModelChange = (modelId) => {
    if (modelId === selectedModel) return;
    setIsSwitching(true);
    setTimeout(() => {
      setSelectedModel(modelId);
      setIsSwitching(false);
    }, 600);
  };

  const activeModelInfo = availableModels.find(m => m.id === selectedModel);
  const activeStyle = MODEL_STYLE_MAP[selectedModel] || DEFAULT_STYLE;

  return (
    <>
      {/* Burbuja lateral (copilot cerrado) */}
      {!copilotOpen && (
        <aside
          ref={bubbleRef}
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          className={`
            fixed bottom-0 right-0 lg:absolute lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2
            flex flex-col-reverse lg:flex-col items-center justify-between
            py-3 w-14 rounded-none bg-[#0B0F17]/70 backdrop-blur-2xl border border-white/10
            shadow-2xl shadow-black/40 z-40 transition-all duration-300
            ${showModelsMobile ? "h-auto" : "h-[68px] lg:h-auto"}
          `}
        >
          <div className="flex flex-col-reverse lg:flex-col items-center gap-1">
            <button
              onClick={handleBotClick}
              className="w-11 h-11 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            >
              <Bot size={18} className="text-slate-200" />
            </button>

            {availableModels.map((model) => {
              const mStyle = MODEL_STYLE_MAP[model.id] || DEFAULT_STYLE;
              const isActive = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => { setCopilotOpen(true); handleModelChange(model.id); }}
                  className={`text-[9px] font-mono w-11 h-11 flex items-center justify-center transition-none rounded-none
                    ${isActive ? `${mStyle.text} font-bold border-l-2 ${mStyle.border}` : "text-slate-500"}
                    ${showModelsMobile ? "flex" : "hidden lg:flex"}`}
                  title={model.name}
                >
                  {mStyle.abbr}
                </button>
              );
            })}
          </div>
          <div className={`w-2 h-2 rounded-none bg-white/30 ${showModelsMobile ? "block" : "hidden lg:block"}`} />
        </aside>
      )}

      {/* Panel del copilot */}
      <div
        className="fixed inset-y-0 right-0 lg:relative h-full bg-[#0B0F17]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl shadow-black/60 flex flex-col overflow-hidden transition-all duration-300 z-50 shrink-0 rounded-none"
        style={{
          width: copilotOpen ? (window.innerWidth < 1024 ? "100%" : `${copilotWidth}px`) : "0px",
          opacity: copilotOpen ? 1 : 0,
          borderLeftWidth: copilotOpen ? "1px" : "0px",
        }}
      >
        {/* Handle de redimensionado */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = copilotWidth;
            const move = (me) => {
              const nw = startWidth + (startX - me.clientX);
              if (nw >= 320 && nw <= 900) setCopilotWidth(nw);
            };
            const up = () => {
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
          className="hidden lg:block absolute left-0 top-0 w-1 h-full cursor-col-resize z-50 bg-transparent hover:bg-blue-500/20"
        />

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center rounded-none">
          <div>
            <h2 className="text-sm text-white">Business Copilot</h2>
            <p className="text-xs text-slate-500">Conectado al contexto del tablero en tiempo real</p>
          </div>
          <button
            onClick={() => setCopilotOpen(false)}
            className="text-[10px] uppercase tracking-wider font-mono text-slate-400 hover:text-white border border-white/10 px-2 py-1 bg-white/5 rounded-none transition-none"
          >
            SALIR
          </button>
        </div>

        {/* Pestañas de modelos — dinámicas */}
        <div className="border-b border-white/10 bg-[#070A10] shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex" style={{ minWidth: `${availableModels.length * 70}px` }}>
            {availableModels.map((model) => {
              const mStyle = MODEL_STYLE_MAP[model.id] || DEFAULT_STYLE;
              const isActive = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={`py-2 px-2 text-[10px] font-mono tracking-wider flex-1 min-w-[70px] flex flex-col items-center gap-0.5 border-b-2 transition-none
                    ${isActive
                      ? `${mStyle.activeBg} ${mStyle.text} font-bold ${mStyle.border.replace("border-", "border-b-")}`
                      : "border-b-transparent text-slate-500 hover:text-slate-300"}`}
                  title={model.name}
                >
                  <span>{mStyle.abbr}</span>
                  <span className="text-[8px] opacity-50 font-sans normal-case tracking-normal">
                    {model.provider === "ollama" ? "🖥 local" : "☁ cloud"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info del modelo activo */}
        <div className="px-4 py-1.5 bg-[#090D14] border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            {activeModelInfo?.provider === "ollama"
              ? <Server size={10} className={activeStyle.text} />
              : <Zap size={10} className={activeStyle.text} />
            }
            <span className={`font-sans ${activeStyle.text}`}>
              {activeModelInfo?.name || selectedModel}
            </span>
          </div>
          <div className="flex gap-3">
            <span>LATENCY <strong className="text-slate-400">{activeModelInfo?.latency || "—"}</strong></span>
            <span className="hidden sm:inline">CONTEXT <strong className="text-slate-400">{activeModelInfo?.tokens || "—"}</strong></span>
          </div>
        </div>

        {/* Debug context */}
        <div className="p-2 text-xs text-green-400 border-b border-white/10 shrink-0 bg-[#070A10]">
          <div className="max-h-16 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(pageContext, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative min-h-0">
          {isSwitching ? (
            <div className="absolute inset-0 bg-[#0B0F17]/95 flex flex-col items-center justify-center z-50">
              <span className="text-xs font-mono text-slate-400 animate-pulse uppercase tracking-widest">
                Reconectado...
              </span>
            </div>
          ) : (
            <ChatCopilotMessage messages={messages} loading={loading} />
          )}
        </div>

        <ChatCopilotInput
          input={input}
          setInput={setInput}
          handleSend={(e) => handleSend(e, { ...pageContext, active_model: selectedModel })}
        />
      </div>
    </>
  );
}
