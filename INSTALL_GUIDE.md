# 🎯 GUÍA COMPLETA - Sistema VozIA Frontend + Backend

## 📚 Contenido
1. [Archivos Creados](#archivos-creados)
2. [Requisitos](#requisitos)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Ejecutar Ambos Servidores](#ejecutar-ambos-servidores)
5. [Testing](#testing)
6. [Características del Frontend](#características-del-frontend)

---

## 📁 Archivos Creados

### Estructura del Proyecto Frontend

```
vozia-frontend/
│
├── 📄 Configuración
│   ├── package.json              # Dependencias y scripts
│   ├── vite.config.js            # Configuración Vite
│   ├── tailwind.config.js        # Configuración Tailwind
│   ├── postcss.config.js         # Configuración PostCSS
│   ├── .env.example              # Variables de entorno ejemplo
│   └── .gitignore                # Archivos a ignorar en Git
│
├── 📂 src/
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Entry point
│   │
│   ├── 📂 components/
│   │   ├── Header.jsx            # Banner superior
│   │   ├── AudioRecorder.jsx     # Grabador y transcripción
│   │   ├── AnalysisResults.jsx   # Resultados del análisis
│   │   ├── ConversationFlow.jsx  # Pasos del proceso
│   │   ├── EmotionBadge.jsx      # Badge de emoción
│   │   └── MetricCard.jsx        # Card de métrica
│   │
│   ├── 📂 services/
│   │   └── api.js                # Cliente HTTP para backend
│   │
│   ├── 📂 styles/
│   │   └── index.css             # Estilos globales + Tailwind
│   │
│   └── 📂 pages/
│       └── (Para futuras rutas)
│
├── 📂 public/
│   └── (Archivos estáticos)
│
├── index.html                    # HTML principal
├── README.md                     # Documentación principal
├── QUICKSTART.md                # Guía rápida
└── SETUP.md                     # Instrucciones de setup

```

### Componentes Creados

| Componente | Función |
|-----------|---------|
| **Header** | Encabezado con logo y descripción |
| **AudioRecorder** | Interfaz para grabar/escribir conversación |
| **AnalysisResults** | Muestra métricas, emociones y recomendaciones |
| **ConversationFlow** | Panel de progreso visual con pasos |
| **EmotionBadge** | Badge colorido de emoción detectada |
| **MetricCard** | Card reutilizable para mostrar métricas |

---

## ✅ Requisitos

### Software Necesario
- ✅ **Python 3.8+** (para backend)
- ✅ **Node.js 16+** (para frontend)
- ✅ **npm o yarn** (gestor de paquetes)
- ✅ **Git** (opcional, para control de versiones)

### Verificar Instalación
```bash
# Python
python --version

# Node.js
node --version
npm --version
```

---

## 🚀 Instalación Paso a Paso

### 📍 Ubicación: Feria_ciencias/

Tu estructura actual:
```
Feria_ciencias/
├── vozia-backend/        ← Tu backend existente
└── vozia-frontend/       ← Nuevo frontend creado
```

### Paso 1: Configurar Backend

```bash
# 1. Navega a la carpeta del backend
cd vozia-backend

# 2. Crea entorno virtual (si no existe)
python -m venv venv

# 3. Activa el entorno
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Instala dependencias
pip install -r requirements.txt

# 5. Opcional: Verifica endpoints
python -c "from main import app; print('✓ Backend OK')"
```

### Paso 2: Configurar Frontend

```bash
# 1. Navega a la carpeta del frontend
cd ../vozia-frontend

# 2. Instala dependencias
npm install

# 3. Verifica instalación
npm list react
```

---

## 🔥 Ejecutar Ambos Servidores

### Opción A: En Dos Terminales (Recomendado)

**Terminal 1 - Backend:**
```bash
cd vozia-backend

# Activa entorno
venv\Scripts\activate  # Windows
# o
source venv/bin/activate  # Linux/Mac

# Ejecuta servidor
python main.py
```

✅ Deberías ver: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 - Frontend:**
```bash
cd vozia-frontend

# Instala dependencias (1ª vez)
npm install

# Inicia servidor
npm run dev
```

✅ Deberías ver: `VITE v4.4.0  ready in XXX ms`

### Opción B: Usar el Mismo Terminal con &

```bash
# Backend en background
cd vozia-backend
venv\Scripts\activate
python main.py &

# Frontend
cd ../vozia-frontend
npm run dev
```

---

## 🌐 Acceder a la Aplicación

### URLs Disponibles

| Servicio | URL | Descripción |
|----------|-----|-----------|
| **Frontend** | http://localhost:3000 | 🎨 Interfaz del usuario |
| **Backend API** | http://localhost:8000 | 🔌 API REST |
| **Docs Backend** | http://localhost:8000/docs | 📚 Documentación interactiva (Swagger) |
| **ReDoc** | http://localhost:8000/redoc | 📖 Documentación alternativa |

---

## 🧪 Testing

### 1. Verificar Conexión Backend

Abre: http://localhost:8000/health

Deberías ver algo como:
```json
{
  "status": "healthy",
  "timestamp": "2024-05-27T10:30:00"
}
```

### 2. Probar Análisis en Docs

Abre: http://localhost:8000/docs

Busca `/analizar-texto` y prueba:
```json
{
  "text": "Hola tengo un problema con mi pago",
  "call_id": "TEST_001"
}
```

### 3. Usar la Interfaz Frontend

Abre: http://localhost:3000

1. Haz clic en "Ver Ejemplo" para cargar conversación de demo
2. Haz clic en "Analizar Conversación"
3. Espera a que se procese
4. Observa los resultados

### Conversaciones de Prueba Disponibles

El frontend incluye 4 conversaciones de demostración:

1️⃣ **Cliente frustrado** - Problema con pago
2️⃣ **Cliente interesado** - Consulta de planes
3️⃣ **Cliente satisfecho** - Elogio del servicio
4️⃣ **Cliente enojado** - Reclamo severo

---

## ✨ Características del Frontend

### 1️⃣ Pantalla de Grabación

```
┌─────────────────────────────────┐
│  VozIA - Análisis de Emociones  │
├─────────────────────────────────┤
│                                 │
│  [🎤 Iniciar Grabación]        │
│  [📤 Ver Ejemplo]              │
│                                 │
│  [Área de Transcripción]       │
│  [Editable - paste tu texto]   │
│                                 │
│  [Analizar Conversación]       │
│  [Limpiar]                     │
└─────────────────────────────────┘
```

### 2️⃣ Pantalla de Análisis

```
┌─────────────────────┐
│  🔄 Analizando...   │
│                     │
│  Procesando audio   │
│  y emociones        │
└─────────────────────┘
```

### 3️⃣ Pantalla de Resultados

```
┌──────────────────────────────────────┐
│  EMOCIÓN DETECTADA: ENOJO 😠         │
│  Confianza: 85%                      │
├──────────────────────────────────────┤
│                                      │
│  📊 Estrés: MODERADO                │
│  📈 Interés: ALTO                   │
│  ⚡ Urgencia: INMEDIATA             │
│  😊 Satisfacción: 20%               │
│                                      │
│  📝 Transcripción Original           │
│  "Mira, esto es inaceptable..."     │
│                                      │
│  🏷️ Temas: pago, frustración        │
│                                      │
│  💡 Recomendación:                  │
│  "Tranquilizar al cliente, ofrecer  │
│   opciones de solución rápida"      │
│                                      │
│  [Nueva Conversación] [Imprimir]   │
└──────────────────────────────────────┘
```

---

## 🎨 Colores y Emociones

El sistema usa colores para cada emoción:

| Emoción | Color | Emoji | Descripción |
|---------|-------|-------|-----------|
| **ENOJO** | 🔴 Rojo | 😠 | Cliente furioso/molesto |
| **ALIVIO** | 🟢 Verde | 😊 | Cliente satisfecho |
| **CONFUSION** | 🟡 Amarillo | 😕 | Cliente confundido |
| **ANSIEDAD** | 🟣 Púrpura | 😰 | Cliente preocupado/urgente |
| **NEUTRAL** | 🔵 Azul | 😐 | Estado neutro |

---

## 🐛 Solución de Problemas

### Backend no responde
```bash
# Verifica que está corriendo
curl http://localhost:8000/health

# Si no funciona:
# 1. Mata proceso en puerto 8000
# 2. Activa entorno virtual
# 3. pip install -r requirements.txt
# 4. python main.py
```

### Frontend no carga
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error de CORS
```
La app no puede conectar al backend.
Solución: Verifica CORS_ORIGINS en vozia-backend/config.py
Debe incluir: "http://localhost:3000"
```

### Audio no graba
```
Problemas de permisos del navegador:
1. Verifica que le diste permiso al micrófono
2. Prueba con Chrome en lugar de Safari
3. En HTTPS necesitas certificado válido
```

---

## 📦 Build para Producción

```bash
# Crear versión optimizada
cd vozia-frontend
npm run build

# La carpeta dist/ contiene la app lista para deployar
```

Puedes hospedar en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier servidor HTTP

---

## 📋 Checklist Final

Antes de presentar al cliente, verifica:

- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 3000
- [ ] Ambos se conectan correctamente (sin errores CORS)
- [ ] Botón "Ver Ejemplo" carga conversaciones
- [ ] "Analizar Conversación" procesa datos
- [ ] Resultados muestran emociones correctamente
- [ ] Métricas se calculan adecuadamente
- [ ] No hay errores en consola (F12)
- [ ] Interfaz es responsiva (prueba en mobile)
- [ ] Puedes imprimir resultados

---

## 🎯 Próximas Mejoras

Para futuras versiones considera:

1. **Base de Datos** - Guardar historial de análisis
2. **Autenticación** - Login de usuarios
3. **Reportes** - Exportar a PDF/Excel
4. **Gráficos** - Charts de tendencias
5. **Realtime** - Análisis en vivo mientras grabas
6. **Mobile App** - Versión nativa Android/iOS
7. **API OAuth** - Integración con sistemas externos

---

## 📞 Soporte

**Documentación:**
- [Frontend README](./vozia-frontend/README.md)
- [Frontend Quick Start](./vozia-frontend/QUICKSTART.md)
- [Backend README](./vozia-backend/README.md)

**Endpoints útiles:**
- `GET /health` - Estado del backend
- `POST /analizar-texto` - Analizar texto
- `POST /analizar-llamada` - Análisis completo

---

**Versión**: 0.1.0  
**Estado**: Demostración/Fase Inicial  
**Actualizado**: 2024-05-27

---

## 🎉 ¡Listo para Presentar!

Tu sistema está completo y listo para mostrar al cliente.

**El flujo es:**
1. Usuario grabación/escribe conversación
2. Frontend procesa el texto
3. Envía al backend para análisis
4. Backend detecta emociones y métricas
5. Frontend muestra resultados visuales

Sin base de datos, sin login, 100% enfocado en las funcionalidades del producto.

¡Buena suerte con la presentación! 🚀
