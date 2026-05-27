#!/bin/bash

# Script de inicio rápido para VozIA
# Uso: ./start.sh

echo "🚀 Iniciando VozIA - Sistema de Análisis de Emociones"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        VOZIA - Análisis Inteligente de Emociones          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar requisitos
echo -e "${YELLOW}📋 Verificando requisitos...${NC}"
echo ""

# Python
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    echo -e "${GREEN}✓${NC} Python: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python no encontrado. Instálalo desde python.org"
    exit 1
fi

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js no encontrado. Instálalo desde nodejs.org"
    exit 1
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm no encontrado"
    exit 1
fi

echo ""
echo -e "${YELLOW}📁 Estructura de carpetas:${NC}"
echo "  ✓ vozia-backend/"
echo "  ✓ vozia-frontend/"
echo ""

echo -e "${YELLOW}🔧 Configurando Backend...${NC}"
echo ""

# Backend setup
cd vozia-backend

if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python -m venv venv
fi

echo "Activando entorno virtual..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate 2>/dev/null || . venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

echo "Instalando dependencias..."
pip install -q -r requirements.txt

echo -e "${GREEN}✓ Backend configurado${NC}"
echo ""

# Frontend setup
cd ../vozia-frontend

echo -e "${YELLOW}🔧 Configurando Frontend...${NC}"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias npm..."
    npm install --quiet
fi

echo -e "${GREEN}✓ Frontend configurado${NC}"
echo ""

# Display instructions
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    ¡Casi Listo!                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📋 Pasos siguientes:${NC}"
echo ""
echo "1️⃣ Abre Terminal 1 (Backend):"
echo -e "   ${GREEN}cd vozia-backend${NC}"
echo -e "   ${GREEN}venv\\Scripts\\activate    # Windows${NC}"
echo -e "   ${GREEN}source venv/bin/activate  # Linux/Mac${NC}"
echo -e "   ${GREEN}python main.py${NC}"
echo ""
echo "2️⃣ Abre Terminal 2 (Frontend):"
echo -e "   ${GREEN}cd vozia-frontend${NC}"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""

echo -e "${YELLOW}🌐 URLs de acceso:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:   ${GREEN}http://localhost:8000${NC}"
echo -e "   API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
echo ""

echo -e "${BLUE}💡 Tips:${NC}"
echo "   • Los datos son de demostración (no hay BD)"
echo "   • Usa 'Ver Ejemplo' para cargar conversaciones de test"
echo "   • El análisis se simula sin conexión a modelos reales"
echo "   • Todo está listo para una demostración al cliente"
echo ""

echo -e "${GREEN}✓ ¡Sistema listo para usar!${NC}"
echo ""
echo "Para más información, abre:"
echo "  • INSTALL_GUIDE.md - Guía completa de instalación"
echo "  • vozia-frontend/README.md - Documentación del frontend"
echo "  • vozia-frontend/QUICKSTART.md - Inicio rápido"
echo "  • ARCHITECTURE.md - Diagrama de arquitectura"
echo ""
