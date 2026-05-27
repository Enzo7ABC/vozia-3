# Configuración de Desarrollo para VozIA Frontend

## Primeros Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Iniciar Desarrollo
```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

## Asegúrate que:

✅ El backend está corriendo en `http://localhost:8000`
✅ CORS está habilitado en el backend para `localhost:3000`
✅ Tienes Node.js 16 o superior instalado

## Build para Producción

```bash
npm run build
npm run preview
```
