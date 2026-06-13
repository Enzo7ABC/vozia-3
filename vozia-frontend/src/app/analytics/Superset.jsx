"use client";
import React, { useEffect, useRef } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';

// VARIABLES DE PRUEBA (Cambiá esto por tus datos reales de Superset cuando los tengas)
const DASHBOARD_ID = "tu-uuid-de-dashboard-aqui"; 
const SUPERSET_DOMAIN = "https://tu-instancia-superset.com";

export default function DashboardPage() {
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchGuestToken = async () => {
      try {
        // MOCK TEMPORAL: Como aún no tenés backend, devolvemos un string simulado.
        // Esto evita el "Failed to fetch" y permite que el SDK intente cargar.
        console.log("Simulando obtención de Guest Token en Frontend...");
        return "un-token-de-prueba-temporal";

        /* // Descomentá esto cuando conectes el backend real:
        const response = await fetch('/api/superset/guest-token');
        const data = await response.json();
        return data.guestToken;
        */
      } catch (error) {
        console.error("Error al obtener el token:", error);
        return "";
      }
    };

    if (dashboardRef.current) {
      embedDashboard({
        id: DASHBOARD_ID, 
        supersetDomain: SUPERSET_DOMAIN,
        mountPoint: dashboardRef.current,
        fetchGuestToken: fetchGuestToken,
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: false,
          filters: {
            expanded: false,
          },
        },
      });
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Mi Reporte de Datos</h2>
      <div ref={dashboardRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
}