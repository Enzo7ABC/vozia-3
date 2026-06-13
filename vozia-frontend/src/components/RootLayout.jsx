import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import ChatCopilot from "../components/copilot/ChatCopilot";

export default function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false); 
  const [copilotWidth, setCopilotWidth] = useState(400);

  return (
    
    <div className="h-screen w-screen flex overflow-hidden bg-slate-950 text-white relative">
      
      {/* 1. SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* 2. CONTENEDOR CENTRAL */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        <div className="flex-1 overflow-auto">
          <Outlet /> 
        </div>
      </div>

      {/* 3. CHAT COPILOT */}
      <ChatCopilot
        copilotOpen={copilotOpen}
        setCopilotOpen={setCopilotOpen}
        copilotWidth={copilotWidth}
        setCopilotWidth={setCopilotWidth}
      />

    </div>
  );
}