
import { createContext, useContext, useState } from "react";

const PageContextBridge = createContext(undefined);

export function PageContextBridgeProvider({ children }) {
  const [pageContext, setPageContext] = useState(null);

  return (
    <PageContextBridge.Provider value={{ pageContext, setPageContext }}>
      {children}
    </PageContextBridge.Provider>
  );
}

export function usePageContextBridge() {
  const context = useContext(PageContextBridge);

  if (context === undefined) {
    throw new Error(
      "usePageContextBridge must be used inside PageContextBridgeProvider"
    );
  }

  return context;
}