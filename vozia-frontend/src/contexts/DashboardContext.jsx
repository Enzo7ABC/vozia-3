import { createContext, useContext, useEffect, useState } from "react";
import { mockDashboardData } from "../app/analytics/dashboard/mockData";

const DashboardContext = createContext(null);

let cachedData = null;
let apiPromise = null;

const fetchFromBackend = () => {
  if (!apiPromise) {
    apiPromise = fetch("http://127.0.0.1:8000/dashboard/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data from backend");
        return res.json();
      })
      .then((data) => {
        cachedData = data;
        return data;
      })
      .catch((err) => {
        console.warn("Backend dashboard fetch failed, falling back to mock data:", err);
        cachedData = mockDashboardData;
        return mockDashboardData;
      });
  }
  return apiPromise;
};

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(cachedData || null);
  const [loading, setLoading] = useState(!cachedData);



  useEffect(() => {
    if (cachedData) {
      setDashboardData(cachedData);
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetchFromBackend().then((data) => {
      if (isMounted) {
        setDashboardData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used inside DashboardProvider");
  }
  return context;
}