
import { useEffect, useRef } from "react";
import { useDashboardContext } from "../../contexts/DashboardContext";
import { usePageContextBridge } from "../../contexts/PageContextBridge"; 

import KPIGrid from "./dashboard/componentes/KPIGrid";
import RevenueChart from "./dashboard/componentes/RevenueChart";
import AIInsights from "./dashboard/componentes/AIInsights";
import TopProducts from "./dashboard/componentes/TopProducts";
import SalesTarget from "./dashboard/componentes/SalesTarget";
import ActivityFeed from "./dashboard/componentes/ActivityFeed";

export default function DashboardPage() {
  const { dashboardData, loading } = useDashboardContext();

  const { setPageContext } = usePageContextBridge(); 

  const syncedRef = useRef(false);

  useEffect(() => {
    if (!dashboardData) return;

  
    setPageContext({
      page: "dashboard",
      data: dashboardData,
    });

    
    return () => {
      setPageContext(null);
    };
  }, [dashboardData, setPageContext]);


  useEffect(() => {
    if (!dashboardData) return;
    if (syncedRef.current) return;

    fetch("http://127.0.0.1:8000/copilot/sync-dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: "session_test_123",
        dashboard: dashboardData,
      }),
    });

    syncedRef.current = true;
  }, [dashboardData]);

  if (loading || !dashboardData) {
    return (
      <main className="h-full bg-[#0B1020] text-white flex items-center justify-center">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="h-full bg-[#0B1020] text-white flex overflow-hidden">

      {/* DASHBOARD */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-6 py-5">

          <KPIGrid data={dashboardData.KPIGrid} />

          <div className="grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-8">
              <RevenueChart data={dashboardData.RevenueChart} />
            </div>

            <div className="col-span-4">
              <AIInsights data={dashboardData.AIInsights} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-4">
              <TopProducts data={dashboardData.TopProducts} />
            </div>

            <div className="col-span-4">
              <SalesTarget data={dashboardData.SalesTarget} />
            </div>

            <div className="col-span-4">
              <ActivityFeed data={dashboardData.ActivityFeed} />
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}