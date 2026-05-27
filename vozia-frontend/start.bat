@echo off
REM Script de inicio rápido para VozIA en Windows
REM Uso: start.bat

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        VOZIA - Análisis Inteligente de Emociones          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 📋 Verificando requisitos...
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no encontrado. Instálalo desde python.org
    pause
    exit /b 1
) else (
    echo [OK] Python detectado
)

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Instálalo desde nodejs.org
    pause
    exit /b 1
) else (
    echo [OK] Node.js detectado
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no encontrado
    pause
    exit /b 1
) else (
    echo [OK] npm detectado
)

echo.
echo 🔧 Configurando Backend...
echo.

cd vozia-backend

if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
)

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias...
pip install -q -r requirements.txt

echo [OK] Backend configurado
echo.

cd ..
cd vozia-frontend

echo 🔧 Configurando Frontend...
echo.

if not exist "node_modules" (
    echo Instalando dependencias npm...
    call npm install --quiet
)

echo [OK] Frontend configurado
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ¡Casi Listo!                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 📋 Pasos siguientes:
echo.
echo 1) Abre CMD/PowerShell Terminal 1 (Backend):
echo    cd vozia-backend
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 2) Abre CMD/PowerShell Terminal 2 (Frontend):
echo    cd vozia-frontend
echo    npm run dev
echo.

echo 🌐 URLs de acceso:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.

echo 💡 Tips:
echo    • Los datos son de demostración (no hay BD)
echo    • Usa 'Ver Ejemplo' para conversaciones de test
echo    • Todo está listo para presentar al cliente
echo.

echo [OK] ¡Sistema listo para usar!
echo.
pause
