# 🏗️ Arquitectura VozIA - Frontend + Backend

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                                  │
│                    (Sin autenticación)                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────┐
        │      VOZIA FRONTEND (React)                │
        │      Puerto: 3000                          │
        │                                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 1. AudioRecorder Component           │ │
        │  │    - Grabar audio del micrófono      │ │
        │  │    - Editar transcripción            │ │
        │  │    - Cargar ejemplos de demostración │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 2. ConversationFlow Component        │ │
        │  │    - Mostrar progreso (paso 1/4)     │ │
        │  │    - Visual feedback                 │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │   [Botón: Analizar Conversación]         │
        │              │                            │
        └──────────────┼────────────────────────────┘
                       │
                       │ HTTP POST
                       │ /api/analizar-llamada
                       │
                       ▼
        ┌────────────────────────────────────────────┐
        │      VOZIA BACKEND (FastAPI)               │
        │      Puerto: 8000                          │
        │                                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 1. Transcription Service             │ │
        │  │    - Convierte audio → texto         │ │
        │  │    - Simulado para demo              │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 2. Emotion Service                   │ │
        │  │    - Analiza emociones               │ │
        │  │    - Detecta temas/palabras clave    │ │
        │  │    - Calcula confianza               │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 3. NLP Service                       │ │
        │  │    - Análisis de lenguaje natural    │ │
        │  │    - Extrae temas principales        │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 4. Endpoints Main                    │ │
        │  │    - Calcula métricas finales        │ │
        │  │    - Genera recomendaciones          │ │
        │  │    - Compone respuesta               │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        └──────────────┼────────────────────────────┘
                       │
                       │ JSON Response
                       │ {
                       │   emotion,
                       │   confidence,
                       │   stress_level,
                       │   interest_level,
                       │   urgency_level,
                       │   satisfaction,
                       │   recommendation,
                       │   topics,
                       │   summary
                       │ }
                       │
                       ▼
        ┌────────────────────────────────────────────┐
        │      VOZIA FRONTEND (React)                │
        │                                            │
        │  ┌──────────────────────────────────────┐ │
        │  │ 3. AnalysisResults Component         │ │
        │  │    - Muestra emoción primaria        │ │
        │  │    - Cards de métricas               │ │
        │  │    - Transcripción original          │ │
        │  │    - Temas detectados                │ │
        │  │    - Recomendación del agente        │ │
        │  │    - Resumen del análisis            │ │
        │  │    - Botones: Nueva Conversación     │ │
        │  │               Imprimir               │ │
        │  └──────────────────────────────────────┘ │
        │              │                            │
        │              ▼                            │
        │   [Pantalla de Resultados Mostrada]      │
        │                                            │
        └────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Detallado

### 1️⃣ Grabación de Audio (AudioRecorder)

```javascript
Usuario hace clic en "Iniciar Grabación"
    ↓
Solicita acceso al micrófono
    ↓
Abre stream de audio
    ↓
Comienza a grabar
    ↓
Usuario detiene la grabación
    ↓
Convierte audio a blob
    ↓
[En esta demo se usa transcripción de ejemplo]
    ↓
Muestra texto en textarea (editable)
```

### 2️⃣ Análisis de Conversación (App + API)

```javascript
Usuario hace clic en "Analizar Conversación"
    ↓
Frontend valida que hay texto
    ↓
Envía POST a /analizar-llamada
    {
      "transcript": "Hola, tengo un problema...",
      "call_id": "DEMO_1234567890",
      "agent_id": "DEMO_AGENT"
    }
    ↓
Backend recibe la solicitud
    ↓
TranscriptionService: Valida transcripción
    ↓
EmotionService: Analiza emociones
    - Busca palabras clave
    - Calcula confianza
    - Detecta emociones secundarias
    ↓
NLPService: Extrae temas
    - Identifica palabras principales
    - Categoriza contenido
    ↓
Main: Calcula métricas finales
    - InterestLevel (ALTO/MEDIO/BAJO)
    - StressLevel (NORMAL/MODERADO/CRITICO)
    - Urgency (BAJA/MEDIA/INMEDIATA)
    - Satisfaction (0-1)
    - Recommendation (texto sugerido)
    ↓
Retorna JSON con análisis completo
```

### 3️⃣ Visualización de Resultados (AnalysisResults)

```javascript
Frontend recibe respuesta del backend
    ↓
Valida que hay datos
    ↓
Renderiza AnalysisResults component
    ↓
Muestra:
  - Emoción primaria con emoji
  - Confianza en porcentaje
  - Cards de métricas (Estrés, Interés, Urgencia, Satisfacción)
  - Transcripción original
  - Temas detectados como badges
  - Recomendación para el agente
  - Resumen del análisis
    ↓
Usuario puede:
  - Ver completo
  - Imprimir (window.print())
  - Iniciar nueva conversación
```

---

## 📦 Componentes y Sus Responsabilidades

### Frontend (React)

```
App.jsx (Orquestador Principal)
├── Header.jsx (Display)
│   └── Muestra logo y descripción
├── ConversationFlow.jsx (State)
│   └── Indica paso actual (1-4)
├── AudioRecorder.jsx (Input)
│   ├── Grabadora de audio
│   ├── Textarea editable
│   ├── Ejemplos de demostración
│   └── Botón de análisis
├── AnalysisResults.jsx (Output)
│   ├── Emoción principal
│   ├── Métricas visuales
│   ├── Transcripción
│   ├── Temas
│   ├── Recomendación
│   └── Botones de acción
└── services/api.js (Comunicación)
    ├── analyzeText()
    ├── analyzeCall()
    ├── uploadAudio()
    └── healthCheck()

Componentes Reutilizables:
├── EmotionBadge.jsx (Badge coloreado)
└── MetricCard.jsx (Card de métrica)
```

### Backend (FastAPI)

```
main.py (API Principal)
├── Endpoints:
│   ├── GET /health (Health check)
│   ├── POST /analizar-texto
│   ├── POST /analizar-llamada
│   └── POST /subir-audio
├── Middleware CORS
└── Documentación automática (/docs)

services/
├── transcription.py
│   ├── TranscriptionService
│   └── transcribe(audio_path) → str
├── emotion.py
│   ├── EmotionAnalysisService
│   └── analyze(text) → dict
└── nlp.py
    ├── NLPService
    └── extract_topics(text) → list

models.py (Tipos de datos)
├── CallAnalysisRequest
├── CallAnalysisResponse
├── EmotionType (Enum)
├── StressLevel (Enum)
└── ...

config.py (Configuración)
├── CORS_ORIGINS
├── API_TITLE
└── ...
```

---

## 🔌 Endpoints del API

### 1. Health Check
```http
GET /health
```
**Respuesta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-05-27T10:30:00"
}
```

### 2. Analizar Texto
```http
POST /analizar-texto
Content-Type: application/json

{
  "text": "Hola, tengo un problema...",
  "call_id": "DEMO_123"
}
```

**Respuesta:**
```json
{
  "emotion_analysis": {
    "primary_emotion": "ENOJO",
    "confidence": 0.85,
    "secondary_emotions": ["FRUSTRATION"]
  },
  "topics": ["pago", "frustración"],
  "call_id": "DEMO_123"
}
```

### 3. Análisis Completo de Llamada
```http
POST /analizar-llamada
Content-Type: application/json

{
  "transcript": "Hola, tengo un problema urgente con mi pago...",
  "call_id": "DEMO_123",
  "agent_id": "AGENT_001"
}
```

**Respuesta:**
```json
{
  "emotion_analysis": {
    "primary_emotion": "ENOJO",
    "confidence": 0.85,
    "secondary_emotions": ["ANSIEDAD"]
  },
  "stress_level": "MODERADO",
  "interest_level": "ALTO",
  "urgency_level": "INMEDIATA",
  "satisfaction": 0.20,
  "recommendation": "Tranquilizar al cliente...",
  "topics": ["pago", "urgencia"],
  "transcript": "Hola, tengo un problema...",
  "summary": "Cliente fuertemente frustrado..."
}
```

---

## 📡 Comunicación entre Servicios

```
Frontend (localhost:3000)
        │
        │ HTTP/CORS
        │
        ▼
Backend (localhost:8000)
        │
        ├─→ TranscriptionService (audio → text)
        │
        ├─→ EmotionService (text → emotions)
        │        │
        │        └─→ Busca palabras clave
        │        └─→ Calcula confianza
        │        └─→ Identifica emociones
        │
        ├─→ NLPService (text → topics)
        │        │
        │        └─→ Extrae términos principales
        │        └─→ Categoriza contenido
        │
        └─→ Main orchestration
                 │
                 └─→ Calcula métricas finales
                 └─→ Genera recomendación
                 └─→ Arma respuesta JSON
```

---

## 🎨 Estados de la Interfaz

### Estado 1: Recording (Grabación)
```
┌─────────────────────────┐
│   Iniciar Grabación     │  ← Activo
│   Ver Ejemplo           │
│   [Área de texto vacía] │
│   [Botones deshabilitados]
└─────────────────────────┘
```

### Estado 2: Analyzing (Analizando)
```
┌─────────────────────────┐
│   🔄 Analizando...      │
│   Espera por respuesta  │
│   Loading animation     │
└─────────────────────────┘
```

### Estado 3: Results (Resultados)
```
┌─────────────────────────┐
│   [Emoción principal]   │
│   [Métricas]            │
│   [Transcripción]       │
│   [Temas]               │
│   [Recomendación]       │
│   [Resumen]             │
│   [Botones de acción]   │
└─────────────────────────┘
```

---

## 🔐 Seguridad (Considera para Producción)

```
Fase Actual (Demo):
├── ✓ Sin autenticación
├── ✓ Sin base de datos
├── ✓ Sin persistencia
└── ✓ Solo demostración

Mejoras Futuras:
├── Autenticación JWT
├── Rate limiting
├── Validación de entrada
├── Encriptación de datos sensibles
├── Base de datos para historial
└── Logs de auditoría
```

---

## 📊 Flujo de Datos en JSON

```javascript
// 1. Frontend envía:
{
  transcript: "Tengo un problema con mi pago",
  call_id: "DEMO_1234567890",
  agent_id: "DEMO_AGENT"
}

// 2. Backend procesa y retorna:
{
  emotion_analysis: {
    primary_emotion: "CONFUSION",
    confidence: 0.75,
    secondary_emotions: ["ENOJO"]
  },
  stress_level: "MODERADO",
  interest_level: "ALTO",
  urgency_level: "MEDIA",
  satisfaction: 0.40,
  recommendation: "Explicar claramente el proceso...",
  topics: ["pago", "proceso", "confusión"],
  transcript: "Tengo un problema con mi pago",
  summary: "Cliente confundido sobre proceso de pago...",
  call_id: "DEMO_1234567890"
}

// 3. Frontend renderiza cada campo en AnalysisResults
```

---

## 🚀 Escala de Operación

### Fase Actual (Demo)
```
1 usuario ← Frontend →  1 servidor backend
                       Sin BD
                       Sin persistencia
                       Análisis en memoria
```

### Fase Siguiente (Producción)
```
Múltiples usuarios ← Load Balancer → Múltiples backends
                                    Con BD (PostgreSQL)
                                    Con caché (Redis)
                                    Modelos ML reales
                                    Análisis asincronos
```

---

Este documento describe la arquitectura completa de VozIA.
Para preguntas técnicas, revisa el código y los READMEs de cada carpeta.

**Última actualización**: 2024-05-27
