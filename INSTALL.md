# 🚀 VozIA — Guía de Instalación y Arranque

## Requisitos Previos (instalar una sola vez)

### 1. Python 3.11+
Descargar desde https://www.python.org/downloads/  
> ✅ Marcar la opción **"Add Python to PATH"** durante la instalación.

### 2. Node.js 18+
Descargar desde https://nodejs.org/  

### 3. Ollama (motor de IA local)
Descargar desde https://ollama.com/download  
Luego, abrir una terminal y descargar los modelos que vas a usar:

```powershell
# Recomendado: rápido y liviano
ollama pull gemma:2b

# Opcional: más preciso pero más lento
ollama pull mistral:7b
```

---

## Primera Instalación del Backend

### Paso 1 — Crear entorno virtual

Abrí PowerShell y ejecutá:

```powershell
cd "C:\programando\vozia3\vozia-backend"
python -m venv venv
.\venv\Scripts\activate
```

> El prompt debe cambiar a `(venv)` para indicar que estás dentro del entorno.

### Paso 2 — Instalar dependencias base

```powershell
pip install -r requirements.txt
```

### Paso 3 — Instalar PyTorch (CPU — compatible con Windows)

> ⚠️ **IMPORTANTE:** No uses `pip install torch` directo. Ese comando instala la versión CUDA que falla en Windows con el error `WinError 126 (fbgemm.dll)`. En su lugar:

```powershell
pip install torch==2.2.0+cpu --index-url https://download.pytorch.org/whl/cpu
```

### Paso 4 — Configurar el archivo `.env`

```powershell
copy .env.example .env
```

El archivo `.env` tiene tres secciones configurables:

#### 🟢 Base de Datos (elige una opción)

**Opción A — Sin base de datos (recomendado para empezar)**  
No configurar nada. El sistema guardará automáticamente las llamadas en un archivo local `calls_db.json`. **Es suficiente para que todo funcione.**

**Opción B — MongoDB Atlas (base de datos en la nube, opcional)**  
Si querés persistencia real y compartida entre equipos, podés crear una cuenta gratuita en [mongodb.com/atlas](https://www.mongodb.com/atlas) y obtener tu propia URI de conexión.
> Los pasos son: Crear cuenta → New Project → Build a Cluster (Free) → Connect → Drivers → copiar la URI y reemplazar `<contraseña>` con tu clave.

#### 🟡 API Key de Groq (opcional, para modelos Cloud)

Si querés usar los modelos cloud (OpenAI/Gemini/Anthropic vía Groq), registrate gratis en [console.groq.com](https://console.groq.com) y pegá tu clave en:
```
GROQ_API_KEY=gsk_tu_clave_aqui
```
> Sin esta clave, los modelos locales de Ollama (gemma:2b, mistral:7b) siguen funcionando normalmente.

---

## Primera Instalación del Frontend

Abrí una **nueva terminal** (sin cerrar la del backend) y ejecutá:

```powershell
cd "C:\programando\vozia3\vozia-frontend"
npm install --legacy-peer-deps
```

> 📝 Se usa `--legacy-peer-deps` porque el proyecto usa React 19 y algunos paquetes reportan compatibilidad con React 18. Los warnings de vulnerabilidades que aparecen son de dependencias de desarrollo y **no bloquean el proyecto**.

---

## ▶️ Arrancar el Backend

```powershell
cd "C:\programando\vozia3\vozia-backend"
.\venv\Scripts\activate
set PYTHONPATH=%CD%
uvicorn app.api.api:app_api --app-dir src --reload --port 8000
```

Si el servidor inició correctamente, verás:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process using StatReload
INFO:     Application startup complete.
```

> ⚠️ **No uses** `python main.py` — ese archivo es un mock de prueba que requiere archivos que no existen. El backend real se arranca con el comando `uvicorn` de arriba.

---

## ▶️ Arrancar el Frontend

Abrí una **segunda terminal** (sin cerrar la del backend):

```powershell
cd "C:\programando\vozia3\vozia-frontend"
npm run dev
```

Luego abrir en el navegador: **http://localhost:3000/**

---------------------------------------------------------------------------------

## 📋 Resumen de Comandos (uso diario)

Una vez instalado todo, para cada sesión de trabajo solo necesitás:

### Terminal 1 — Backend
```powershell
cd "C:\programando\vozia3\vozia-backend"
.\venv\Scripts\activate
set PYTHONPATH=%CD%
uvicorn app.api.api:app_api --app-dir src --reload --port 8000
```

### Terminal 2 — Frontend
```powershell
cd "C:\programando\vozia3\vozia-frontend"
npm run dev
```

---

## 🤖 Modelos de IA disponibles

| Modelo | Tipo | Velocidad | Requisito |
|---|---|---|---|
| `openai` / `gemini` / `anthropic` | Cloud (Groq) | ~1-2s | `GROQ_API_KEY` en `.env` |
| `gemma:2b` | Local (Ollama) | ~5s | `ollama pull gemma:2b` |
| `mistral:7b` | Local (Ollama) | ~10-30s | `ollama pull mistral:7b` |

> 💡 **Recomendación:** Para desarrollo y pruebas rápidas, usar **gemma:2b** local o configurar una clave Groq gratuita en https://console.groq.com/ para acceder a los modelos cloud.

---

## ❓ Solución de Problemas Comunes

### Error: `WinError 126` o `fbgemm.dll not found`
PyTorch con CUDA no es compatible. Desinstalar y reinstalar la versión CPU:
```powershell
pip uninstall torch -y
pip install torch==2.2.0+cpu --index-url https://download.pytorch.org/whl/cpu
```

### Error: `MONGO_URI contains placeholder`
El archivo `.env` tiene el valor de ejemplo sin configurar. Podés dejarlo así — el sistema usa automáticamente una base de datos local (`calls_db.json`) como fallback.

### Error: `model 'xxx' not found` en Ollama
El modelo no está descargado. Ejecutar:
```powershell
ollama pull gemma:2b
```

### El frontend dice `EACCES` o falla `npm install`
Usar el flag de compatibilidad:
```powershell
npm install --legacy-peer-deps
```

### El backend no encuentra módulos (`ModuleNotFoundError`)
Asegurarse de haber seteado el PYTHONPATH antes de arrancar uvicorn:
```powershell
set PYTHONPATH=%CD%
```
