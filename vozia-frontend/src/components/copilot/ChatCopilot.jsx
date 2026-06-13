import React, { useState } from "react";
import { Bot, LayoutDashboard, TrendingUp, Sparkles, Cpu } from "lucide-react";
import ChatCopilotInput from "../copilot/ChatCopilotInput";
import ChatCopilotMessage from "../copilot/ChatCopilotMessage";

import { useChatCopilotContext } from "../../contexts/ChatCopilotContext";
import { usePageContextBridge } from "../../contexts/PageContextBridge";

export default function ChatCopilot({
  copilotOpen,
  setCopilotOpen,
  copilotWidth,
  setCopilotWidth,
}) {
  const { input, setInput, loading, messages, handleSend } = useChatCopilotContext();
  const { pageContext } = usePageContextBridge();


  const [selectedModel, setSelectedModel] = useState("openai");
  const [isSwitching, setIsSwitching] = useState(false);


  const modelsConfig = {
    openai: { name: "OpenAI GPT-4", latency: "1.2s", tokens: "128k", color: "text-emerald-400" },
    gemini: { name: "Gemini 1.5 Pro", latency: "0.8s", tokens: "2m", color: "text-blue-400" },
    anthropic: { name: "Anthropic Claude 3.5", latency: "1.5s", tokens: "200k", color: "text-orange-400" }
  };

  const handleModelChange = (modelKey) => {
    if (modelKey === selectedModel) return;
    setIsSwitching(true);
    setTimeout(() => {
      setSelectedModel(modelKey);
      setIsSwitching(false);
    }, 600);
  };

  return (
    <>

      {!copilotOpen && (
        <aside
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            flex flex-col items-center justify-between
            py-3 w-14 h-[260px]
            rounded-none
            bg-[#0B0F17]/70
            backdrop-blur-2xl
            border border-white/10
            shadow-2xl shadow-black/40
            z-40
          "
        >
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setCopilotOpen(true)}
              className="
                w-11 h-11 rounded-none
                bg-white/5 border border-white/10
                flex items-center justify-center
                hover:bg-white/10 transition
              "
            >
              <Bot size={18} className="text-slate-200" />
            </button>
            

            <button 
              onClick={() => { setCopilotOpen(true); handleModelChange("openai"); }}
              className={`text-[10px] font-mono w-11 h-11 flex items-center justify-center transition-none ${selectedModel === "openai" ? "text-emerald-400 font-bold border-l border-emerald-500" : "text-slate-500"}`}
            >
              OAI
            </button>
            <button 
              onClick={() => { setCopilotOpen(true); handleModelChange("gemini"); }}
              className={`text-[10px] font-mono w-11 h-11 flex items-center justify-center transition-none ${selectedModel === "gemini" ? "text-blue-400 font-bold border-l border-blue-500" : "text-slate-500"}`}
            >
              GEM
            </button>
            <button 
              onClick={() => { setCopilotOpen(true); handleModelChange("anthropic"); }}
              className={`text-[10px] font-mono w-11 h-11 flex items-center justify-center transition-none ${selectedModel === "anthropic" ? "text-orange-400 font-bold border-l border-orange-500" : "text-slate-500"}`}
            >
              ANT
            </button>
          </div>
          <div className="w-2 h-2 rounded-none bg-white/30" />
        </aside>
      )}


      <div
        className="
          fixed inset-y-0 right-0 lg:relative
          h-full
          bg-[#0B0F17]/95
          backdrop-blur-3xl
          border-l border-white/10
          shadow-2xl shadow-black/60
          flex flex-col
          overflow-hidden
          transition-all duration-300
          z-50
          shrink-0
          rounded-none
        "
        style={{
       
          width: copilotOpen ? (window.innerWidth < 1024 ? "100%" : `${copilotWidth}px`) : "0px",
          opacity: copilotOpen ? 1 : 0,
          borderLeftWidth: copilotOpen ? "1px" : "0px", 
        }}
      >
        
     
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = copilotWidth;

            const handleMouseMove = (moveEvent) => {
              const newWidth = startWidth + (startX - moveEvent.clientX);
              if (newWidth >= 320 && newWidth <= 900) {
                setCopilotWidth(newWidth);
              }
            };

            const handleMouseUp = () => {
              window.removeEventListener("mousemove", handleMouseMove);
              window.removeEventListener("mouseup", handleMouseUp);
            };

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
          }}
          className="hidden lg:block absolute left-0 top-0 w-1 h-full cursor-col-resize z-50 bg-transparent hover:bg-blue-500/20"
        />


        <div className="p-4 border-b border-white/10 flex justify-between items-center rounded-none">
          <div>
            <h2 className="text-sm text-white">Business Copilot</h2>
            <p className="text-xs text-slate-500">Connected to live dashboard context</p>
          </div>
          <button
            onClick={() => setCopilotOpen(false)}
            className="text-[10px] uppercase tracking-wider font-mono text-slate-400 hover:text-white border border-white/10 px-2 py-1 bg-white/5 rounded-none transition-none"
          >
            DISCONNECT
          </button>
        </div>


        <div className="grid grid-cols-3 border-b border-white/10 bg-[#070A10] text-center shrink-0">
          <button
            onClick={() => handleModelChange("openai")}
            className={`py-2 text-[11px] font-mono tracking-wider transition-none ${
              selectedModel === "openai" ? "bg-white/5 text-emerald-400 font-bold border-b border-emerald-500" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            OPENAI
          </button>
          <button
            onClick={() => handleModelChange("gemini")}
            className={`py-2 text-[11px] font-mono tracking-wider transition-none ${
              selectedModel === "gemini" ? "bg-white/5 text-blue-400 font-bold border-b border-b-blue-500" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            GEMINI
          </button>
          <button
            onClick={() => handleModelChange("anthropic")}
            className={`py-2 text-[11px] font-mono tracking-wider transition-none ${
              selectedModel === "anthropic" ? "bg-white/5 text-orange-400 font-bold border-b border-b-orange-500" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            ANTHROPIC
          </button>
        </div>

        {/* MONITOR DE METRICAS DEL MODELO */}
        <div className="px-4 py-1.5 bg-[#090D14] border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            <Cpu size={10} className={modelsConfig[selectedModel].color} />
            <span className="text-slate-300 font-sans">{modelsConfig[selectedModel].name}</span>
          </div>
          <div className="flex gap-3">
            <span>LATENCY: <strong className="text-slate-400">{modelsConfig[selectedModel].latency}</strong></span>
            <span className="hidden sm:inline">CONTEXT: <strong className="text-slate-400">{modelsConfig[selectedModel].tokens}</strong></span>
          </div>
        </div>

        {/* PAYLOAD CONTEXT ORIGINAL */}
        <div className="p-2 text-xs text-green-400 border-b border-white/10 shrink-0 bg-[#070A10]">
          <div className="max-h-16 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(pageContext, null, 2)}
            </pre>
          </div>
        </div>

        {/* CONTENEDOR DE HISTORIAL CON INTERRUPTOR DE CARGA */}
        <div className="flex-1 flex flex-col relative min-h-0">
          {isSwitching ? (
            <div className="absolute inset-0 bg-[#0B0F17]/95 flex flex-col items-center justify-center z-50">
              <span className="text-xs font-mono text-slate-400 animate-pulse uppercase tracking-widest">
                Reconnecting Model Pipeline...
              </span>
            </div>
          ) : (
            <ChatCopilotMessage messages={messages} loading={loading} />
          )}
        </div>
        
        {/* ENTRADA DE INPUT ORIGINAL */}
        <ChatCopilotInput 
          input={input} 
          setInput={setInput} 
          handleSend={(e) => handleSend(e, { ...pageContext, active_model: selectedModel })} 
        />
      </div>
    </>
  );
}