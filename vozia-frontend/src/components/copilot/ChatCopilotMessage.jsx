import React from "react";

export default function ChatCopilotMessage({ messages, loading }) {

  const renderContent = (content) => {
    if (typeof content === "object" && content !== null) {
      return (
        <pre className="text-sm font-mono text-amber-400/90 bg-black/40 p-2 rounded-lg overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
    
    try {

      const parsed = JSON.parse(content);
      if (typeof parsed === "object") {
        return (
          <pre className="text-sm font-mono text-amber-400 bg-black/40 p-2 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      }
    } catch (e) {

    }

    return <div className="text-sm text-slate-200 mt-1">{content}</div>;
  };

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {messages.map((msg, idx) => {
        if (msg.type === "system") {
          return (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-slate-500 mb-1">
                LIVE CONTEXT
              </div>
              <div className="text-sm text-slate-200">
                {msg.content}
              </div>
            </div>
          );
        }

        if (msg.type === "ai") {
          return (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-slate-500">AI Insight</div>
              {renderContent(msg.content)}
            </div>
          );
        }

        if (msg.type === "signal") {
          return (
            <div key={idx} className="text-xs text-slate-400">
              {msg.content}
            </div>
          );
        }

  return (
  <div key={idx} className="flex justify-end">
    <div className="text-sm text-slate-300 bg-white/10 p-2 rounded-xl max-w-[80%]">
      {msg.content}
    </div>
  </div>
);
      })}

      {loading && (
        <div className="text-xs text-slate-400 animate-pulse">
          Analyzing business data...
        </div>
      )}
    </div>
  );
}