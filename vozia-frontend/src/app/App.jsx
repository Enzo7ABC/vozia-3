import { Routes, Route } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import Page_IA_Voz from "../pages/Page_Ia_Voz";
import Page_Analytics from "../pages/Page_Analytics"; 



import { PageContextBridgeProvider } from "../contexts/PageContextBridge";
import { ChatCopilotProvider } from "../contexts/ChatCopilotContext";
import { DashboardProvider } from "../contexts/DashboardContext"; 

function App() {
  return (
    <PageContextBridgeProvider>
      <DashboardProvider>
        <ChatCopilotProvider>
          
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Page_IA_Voz />} />
              <Route path="/dashboard" element={<Page_Analytics />} />
            
            </Route>
          </Routes>

        </ChatCopilotProvider>
      </DashboardProvider>
    </PageContextBridgeProvider>
  );
}

export default App;