# 🏗️ Arquitectura VozIA — Frontend + Backend (Agente LangGraph)

Este documento detalla la arquitectura actual y el flujo de datos del sistema **VozIA** con orquestación inteligente de agentes.

---

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL / AGENTE                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────────┐
         │      VOZIA FRONTEND (React + Vite)         │
         │      Puerto: 3000                          │
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │ 1. AudioRecorder (Panel Izquierdo)   │  │
         │  │    - Graba audio por micrófono       │  │
         │  │    - Carga ejemplos precargados      │  │
         │  │    - Permite editar transcripción    │  │
         │  └──────────────────────────────────────┘  │
         │                     │                      │
         │                     ▼                      │
         │  ┌──────────────────────────────────────┐  │
         │  │ 2. ChatCopilot (Panel Lateral)       │  │
         │  │    - Chatea con el Copiloto de IA    │  │
         │  │    - Recibe guías adaptativas        │  │
         │  └──────────────────────────────────────┘  │
         └─────────────┬──────────────────┬───────────┘
                       │                  │
            POST /ia-voz/call-state       │ POST /copilot/chat
                       │                  │
                       ▼                  ▼
         ┌────────────────────────────────────────────┐
         │      VOZIA BACKEND (FastAPI)               │
         │      Puerto: 8000                          │
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │ 1. Grafo de Análisis (LangGraph)     │  │
         │  │    - extract_transcript              │  │
         │  │    - build_prompt (Directiva suma 100)│ │
         │  │    - llm_analysis (Ollama/Groq Client)│ │
         │  │    - parse_response                  │  │
         │  │    - update_state (Métricas finales) │  │
         │  └──────────────────────────────────────┘  │
         │                     │                      │
         │                     ▼                      │
         │  ┌──────────────────────────────────────┐  │
         │  │ 2. Grafo del Copiloto (LangGraph)     │  │
         │  │    - Router: CONTENCION, RETENCION,  │  │
         │  │      COMERCIAL u OPERATIVO           │  │
         │  │    - Inyección de Directivas         │  │
         │  └──────────────────────────────────────┘  │
         │                     │                      │
         │                     ▼                      │
         │  ┌──────────────────────────────────────┐  │
         │  │ 3. Motor Fallback (NLP Local)        │  │
         │  │    - PyTorch + pysentimiento en CPU  │  │
         │  └──────────────────────────────────────┘  │
         └─────────────┬──────────────────┬───────────┘
                       │                  │
                       ▼                  ▼
         ┌────────────────────────────────────────────┐
         │              PERSISTENCIA                  │
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │ - MongoDB Atlas (En la nube)         │  │
         │  │ - calls_db.json (Fallback local JSON)│  │
         │  └──────────────────────────────────────┘  │
         └─────────────────────┬──────────────────────┘
                               │
                               ▼
         ┌────────────────────────────────────────────┐
         │       DASHBOARD DE RESULTADOS (React)      │
         │                                            │
         │  - Indicadores en tiempo real (Timeline)   │
         │  - Emojis dinámicos (Confianza %)          │
         │  - Reporte de Recomendaciones e Historial  │
         └────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Detallado

### 1️⃣ Análisis de la Conversación
1. El usuario realiza la simulación en la interfaz. El frontend envía la transcripción al endpoint `/ia-voz/call-state` en [api.py](file:///c:/programando/vozia3/vozia-backend/src/app/api/api.py).
2. El backend invoca el grafo principal de **LangGraph** ([graph_ia_voz.py](file:///c:/programando/vozia3/vozia-backend/src/app/ai_core/graphs/graph_ia_voz.py)):
   * **`extract_transcript`:** Lee el audio/texto ingresado.
   * **`build_prompt`:** Prepara las instrucciones en base a [prompt_ai_voz.py](file:///c:/programando/vozia3/vozia-backend/src/app/ai_core/prompts/prompt_ai_voz.py) priorizando los últimos 6 segundos. Si es un modelo Ollama, inyecta la directiva de Suma 100 de las 4 métricas emocionales.
   * **`llm_analysis`:** Invoca al modelo en la nube (Groq) o local (Ollama). Si el LLM no está disponible, **activa automáticamente el fallback local** mediante PyTorch y `pysentimiento` para obtener el estado emocional directamente en el procesador.
   * **`parse_response`:** Sanitiza y convierte la salida en JSON.
   * **`update_state`:** Actualiza el estado mutable de la llamada.
3. Se actualiza la línea de tiempo (`timeline`) con el registro segundo a segundo.
4. Si la llamada es finalizada (`is_final`), se guarda en la base de datos (**MongoDB Atlas** o local **calls_db.json**).

### 2️⃣ Asistencia al Operador (Copiloto)
1. El agente escribe en la barra del chat del copiloto.
2. El frontend envía la pregunta a `/copilot/chat`.
3. El backend ejecuta el grafo del copiloto ([graph_copilot.py](file:///c:/programando/vozia3/vozia-backend/src/app/ai_core/graphs/graph_copilot.py)) que calcula las métricas actuales del cliente:
   * Si la palabra clave "baja" está en el texto o la urgencia es $\geq 80$: Rutera a **RETENCION**.
   * Si la angustia es $\geq 70$ y la satisfacción es $\leq 30$: Rutera a **CONTENCION**.
   * Si el interés es $\geq 70$: Rutera a **COMERCIAL**.
   * De lo contrario: Rutera a **OPERATIVO**.
4. Cada ruta inyecta directivas específicas al prompt del LLM sobre qué responder, qué decir y qué evitar.
5. El LLM responde adoptando la personalidad del asistente elegido y las directivas del negocio.

---

## 📦 Estructura de Módulos (Backend)

* **`src/app/api/api.py`:** Define los endpoints REST, el control de la base de datos híbrida (Mongo / JSON) y la API de carga de audios.
* **`src/app/ai_core/graphs/`:** Contiene los flujos lógicos estructurados mediante LangGraph (`graph_ia_voz.py` y `graph_copilot.py`).
* **`src/app/ai_core/nodes/`:** Define el comportamiento e instrucciones ejecutadas en cada paso del flujo (`nodes_ia_voz.py`).
* **`src/app/ai_core/connectors/`:** Administra las conexiones locales con Ollama y la rotación multi-llave en la nube con Groq.
* **`src/app/nlp/`:** Motor secundario offline para análisis local.

---

## 🎨 Estados de la Interfaz

1. **Estado de Grabación:** Captura de voz, visualización del contador de tiempo y editor de texto.
2. **Estado de Análisis:** Pantalla de carga animada (loading state) mientras se ejecuta el grafo de IA.
3. **Estado de Resultados:** Muestra las métricas calculadas, curvas de evolución emocional (Timeline) y recomendaciones.
4. **Estado de Copiloto:** Panel lateral que asiste al agente telefónico en vivo.
