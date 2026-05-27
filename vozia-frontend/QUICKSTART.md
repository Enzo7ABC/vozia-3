# VozIA Frontend - Guía de Inicio Rápido

## 📋 Requisitos Previos

- **Node.js** 16 o superior
- **npm** o **yarn**
- **Backend VozIA** ejecutándose en `http://localhost:8000`

## 🚀 Instalación en 3 Pasos

### Paso 1: Instalar Dependencias
```bash
cd vozia-frontend
npm install
```

### Paso 2: Configurar Conexión (Opcional)
Si tu backend NO está en `http://localhost:8000`, crea `.env.local`:
```bash
VITE_API_URL=http://tu-servidor:8000
```

### Paso 3: Iniciar la Aplicación
```bash
npm run dev
```

✅ ¡Listo! Abre http://localhost:3000 en tu navegador

---

## 🎯 ¿Qué Ver en la Interfaz?

### 1️⃣ Pantalla de Grabación
- Botón grande para iniciar grabación
- Área de texto para transcripción
- Botón "Ver Ejemplo" con conversaciones de demostración
- Botón "Analizar Conversación"

### 2️⃣ Pantalla de Análisis
- Loading animado mientras se procesa
- Indicador de progreso

### 3️⃣ Resultados Finales
Muestra:
- 🎭 **Emoción Detectada** - Enojo, Alivio, Confusión, Ansiedad, Neutral
- 📊 **Métricas** - Estrés, Interés, Urgencia, Satisfacción
- 📝 **Transcripción Original**
- 🏷️ **Temas Detectados** - Palabras clave extraídas
- 💡 **Recomendación** - Sugerencia para el agente
- 📋 **Resumen del Análisis**

---

## 🔌 Conectar con tu Backend

El frontend se conecta automáticamente a:
- **Endpoint de Salud**: `GET /health`
- **Análisis de Texto**: `POST /analizar-texto`
- **Análisis Completo**: `POST /analizar-llamada`
- **Upload de Audio**: `POST /subir-audio`

### ¿Sin Backend disponible?
La app tiene un **modo demo** que simula análisis automáticamente.

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor local (puerto 3000)

# Producción
npm run build        # Crea carpeta dist/ para deploy
npm run preview      # Previsualiza el build localmente

# Calidad de código
npm run lint         # Verifica errores de linting
```

---

## 📱 Características

✨ **Interfaz Moderna**
- Diseño responsivo (Desktop, Tablet, Mobile)
- Animaciones suaves
- Paleta de colores profesional

🔊 **Captura de Audio**
- Grabadora de micrófono integrada
- Editor de transcripción
- Ejemplos pre-cargados para demostración

🧠 **Análisis Inteligente**
- Detección de emociones
- Análisis de urgencia y estrés
- Extracción de temas principales
- Cálculo de satisfacción del cliente
- Recomendaciones para agentes

📊 **Visualización de Datos**
- Cards de métricas
- Badges de emociones
- Flujo visual de progreso
- Resumen ejecutivo

---

## 🐛 Solución de Problemas

### "No puedo conectar al backend"
```
❌ Verifica que el backend esté corriendo: http://localhost:8000
❌ Revisa la consola del navegador (F12) para errores CORS
❌ Añade http://localhost:3000 a CORS_ORIGINS en el backend
```

### "No funciona la grabación de audio"
```
❌ Verifica permisos del navegador
❌ Prueba con Chrome o Firefox
❌ En HTTPS, necesitas certificado válido
```

### "Los estilos no cargan correctamente"
```bash
❌ npm install
❌ npm run build
```

---

## 📦 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 18.2 | Framework UI |
| Vite | 4.4 | Build tool |
| Tailwind CSS | 3.3 | Estilos |
| Axios | 1.6 | Cliente HTTP |
| React Icons | 4.11 | Iconografía |

---

## 🌐 Desplegar a Producción

### En Vercel (Recomendado)
1. Push a GitHub
2. Conecta repo en vercel.com
3. Deploy automático

### En Netlify
1. `npm run build`
2. Sube carpeta `dist/` a Netlify
3. Configura variable `VITE_API_URL` en settings

### En servidor propio
1. `npm run build`
2. Sube contenido de `dist/` a tu servidor
3. Asegura que el API_URL es accesible desde producción

---

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

---

**Versión**: 0.1.0  
**Estado**: Demo/Fase Inicial  
**Última actualización**: 2024
