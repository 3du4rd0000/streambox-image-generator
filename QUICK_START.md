# ⚡ Quick Start - Image Generator Service

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
cd image-generator-service
npm install
```

### 2. Copiar Logos
```bash
# Ajustar ruta según tu estructura
cp -r ../streamboxtv/public/teams ./public/
```

### 3. Configurar
```bash
cp .env.example .env
# Editar .env si es necesario
```

### 4. Iniciar
```bash
npm start
```

### 5. Probar
```bash
# Health check
curl http://localhost:3001/health

# Generar imagen de prueba
curl -X POST http://localhost:3001/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "gameData": {
      "awayTeam": {"name": "Buffalo Bills", "score": 28},
      "homeTeam": {"name": "Pittsburgh Steelers", "score": 24},
      "sport": "nfl",
      "league": "NFL"
    }
  }' \
  --output test.png
```

## 📦 Desplegar a Railway (Más Fácil)

1. **Crear cuenta en Railway**: https://railway.app
2. **Nuevo Proyecto** → "Deploy from GitHub repo"
3. **Conectar repositorio** con el servicio
4. **Variables de entorno**:
   - `PORT`: 3001 (o dejar que Railway asigne)
   - `TEAMS_PATH`: `/app/public/teams`
5. **Subir logos**: Usar Railway Volumes o incluir en Git
6. **Desplegar**: Railway lo hace automáticamente

## 🔗 Configurar en Vercel

En **Vercel Dashboard → Settings → Environment Variables**:
```
IMAGE_GENERATOR_API_URL=https://tu-proyecto.up.railway.app
```

## ✅ Listo!

El cron job de Vercel ahora usará la API externa para generar imágenes.

