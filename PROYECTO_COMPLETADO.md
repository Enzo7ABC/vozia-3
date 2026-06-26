# ✅ PROYECTO VOZIA - COMPLETADO Y OPERATIVO

## 🎉 Resumen del Estado del Proyecto

VozIA ha sido desarrollado como un sistema completo de nivel profesional con arquitectura frontend/backend moderna, orquestación inteligente de IA basada en grafos y persistencia híbrida de datos.

---

## 🛠️ Tecnologías y Módulos Clave

### 💻 Frontend (React + Vite)
* **Páginas de la Aplicación:**
  * **Analizador Principal (`ai-voz`):** Panel interactivo con el componente `AudioRecorder` que soporta grabación por micrófono y la inserción de casos prácticos cargados por defecto. Muestra el componente `AnalysisResults` con métricas, emojis y recomendaciones.
  * **Historial General (`historial`):** Permite explorar de forma retrospectiva las llamadas registradas en la base de datos y reproducir los audios correspondientes.
  * **Dashboard de Analíticas (`analytics`):** Agrega métricas globales del Call Center como volumen total de llamadas, nivel promedio de urgencia, porcentaje general de satisfacción del cliente y gráficos de evolución temporal de los indicadores.
* **Componente de Copiloto (`ChatCopilot`):** Panel de chat en tiempo real integrado que guía paso a paso al operador.

### ⚙️ Backend (FastAPI + LangGraph)
* **Grafo de Estado Principal (`app_agent_call_state`):** Gestiona de forma resuelta el análisis emocional en tiempo real a través de nodos de análisis, inyección de prompts y parsing estructurado de JSON.
* **Grafo de Copiloto de Negocios (`app_copilot`):** Enrutador inteligente heurístico que evalúa el estado emocional del cliente en la llamada y asigna de manera automatizada las directivas de soporte comercial, soporte de retención o contención de tensión.
* **Conectores de IA Híbridos:**
  * Soporte local a través de **Ollama** con el modelo superligero Gemma 2B o Mistral 7B.
  * Soporte en la nube mediante **Groq Cloud** (Llama 3.3 70B de ultra-baja latencia) con rotación automática de múltiples API Keys para evitar bloqueos por cuotas.
* **NLP Fallback Local:** Motor basado en PyTorch y `pysentimiento` que asegura el funcionamiento ininterrumpido en CPU local si falla internet o la API externa.
* **Persistencia Híbrida:** Guardado en la base de datos en la nube **MongoDB Atlas** o persistencia de fallback en el archivo JSON local `calls_db.json`.

---

## 🚀 Guía de Arranque Diario

### Paso 1: Levantar el Backend (FastAPI)
1. Abre una terminal y colócate en la carpeta del backend:
   ```powershell
   cd "C:\programando\vozia3\vozia-backend"
   ```
2. Activa el entorno virtual e inicia el servidor con PYTHONPATH configurado:
   ```powershell
   .\venv\Scripts\activate
   set PYTHONPATH=%CD%
   uvicorn app.api.api:app_api --app-dir src --reload --port 8000
   ```
3. Espera a ver: ✅ `Uvicorn running on http://127.0.0.1:8000`

### Paso 2: Levantar el Frontend (React + Vite)
1. Abre una segunda terminal y colócate en la carpeta del frontend:
   ```powershell
   cd "C:\programando\vozia3\vozia-frontend"
   ```
2. Inicia el servidor de desarrollo:
   ```powershell
   npm run dev
   ```
3. Abre el navegador en: **http://localhost:3000**
