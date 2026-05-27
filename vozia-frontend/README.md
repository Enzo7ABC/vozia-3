# VozIA Frontend

Frontend React moderno para el sistema de análisis inteligente de emociones en conversaciones.

## 🚀 Instalación Rápida

### Requisitos
- Node.js 16+
- npm o yarn

### Pasos

1. **Navega a la carpeta del proyecto**
```bash
cd vozia-frontend
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre en tu navegador**
```
http://localhost:3000
```

## 📋 Características

✅ **Interfaz sin autenticación** - Acceso directo a todas las funcionalidades
✅ **Grabadora de audio** - Captura de voz del usuario
✅ **Transcripción en tiempo real** - Conversión de audio a texto
✅ **Análisis emocional** - Detección automática de emociones
✅ **Dashboard visual** - Métricas y insights claros
✅ **Ejemplos de demostración** - Conversaciones pre-grabadas para testing
✅ **Interfaz responsiva** - Funciona en desktop y mobile
✅ **Sin base de datos** - Solo demostración del producto

## 🎯 Flujo de la Aplicación

1. **Grabación** - El usuario graba su conversación o carga una transcripción
2. **Transcripción** - El audio se convierte a texto
3. **Análisis** - Se detectan emociones, urgencias y temas
4. **Resultados** - Se muestran métricas y recomendaciones

## 🛠️ Estructura del Proyecto

```
vozia-frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── Header.jsx
│   │   ├── AudioRecorder.jsx
│   │   ├── AnalysisResults.jsx
│   │   ├── ConversationFlow.jsx
│   │   ├── EmotionBadge.jsx
│   │   └── MetricCard.jsx
│   ├── pages/               # Páginas (para futuras rutas)
│   ├── services/
│   │   └── api.js          # Cliente HTTP para backend
│   ├── styles/
│   │   └── index.css       # Estilos globales
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
├── public/                  # Archivos estáticos
├── index.html              # HTML principal
├── vite.config.js          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind CSS
├── package.json            # Dependencias
└── README.md              # Este archivo
```

## 📡 Configuración del Backend

El frontend está configurado para conectar con el backend en:
- **URL base**: `http://localhost:8000`

Para cambiar la URL:
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega: `VITE_API_URL=http://tu-api:puerto`

### Endpoints Utilizados
- `GET /health` - Verificar conexión
- `POST /analizar-texto` - Analizar texto
- `POST /analizar-llamada` - Análisis completo
- `POST /subir-audio` - Subir archivo de audio

## 🎨 Stack Tecnológico

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **JavaScript ES6+** - Lenguaje

## 📱 Características por Pantalla

### Pantalla de Grabación
- Botón para iniciar/detener grabación
- Área de transcripción editable
- Ejemplos de demostración
- Botón para analizar

### Pantalla de Análisis
- Loading animado
- Indicador de progreso

### Pantalla de Resultados
- Emoción primaria detectada
- Métricas de estrés, interés, urgencia
- Nivel de satisfacción
- Transcripción original
- Temas detectados
- Recomendaciones para el agente
- Opción para imprimir resultados
- Botón para iniciar nueva conversación

## 🔄 CORS

El frontend está configurado para funcionar con CORS habilitado en el backend.
Asegúrate de que `CORS_ORIGINS` en el backend incluya:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## 📝 Variables de Entorno

```env
# Conexión al API
VITE_API_URL=http://localhost:8000

# (Opcional) Configuración adicional
VITE_DEBUG=false
```

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Revisa la consola del navegador (F12) para ver errores CORS
- Asegúrate de que CORS está habilitado en el backend

### El audio no se graba
- Verifica permisos de micrófono del navegador
- Intenta un navegador diferente (Chrome, Firefox, Edge)
- En HTTPS, el micrófono requiere conexión segura

### Los estilos Tailwind no cargan
```bash
npm run build
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor local

# Producción
npm run build        # Build para producción
npm run preview      # Previsualiza build
npm run lint         # Verifica código (si eslint está configurado)
```

## 🚀 Despliegue

Para producción:
```bash
npm run build
```

Esto generará una carpeta `dist/` lista para desplegar en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier servidor HTTP

## 📄 Licencia

Parte del Proyecto Integrador - ISPC 2024

## 👨‍💻 Autor

Equipo de Desarrollo - VozIA Project
