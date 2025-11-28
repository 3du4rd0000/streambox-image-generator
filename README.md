# 🎨 StreamBox Image Generator Service

API externa para generar imágenes de resultados deportivos usando Canvas.

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Logos de equipos en `public/teams/` (copiar desde `streamboxtv/public/teams`)

## 🚀 Instalación Local

```bash
# Instalar dependencias
npm install

# Copiar logos (ajustar ruta según tu estructura)
# Los logos deben estar en: public/teams/
cp -r ../streamboxtv/public/teams ./public/

# Configurar variables de entorno
cp .env.example .env
# Editar .env y ajustar TEAMS_PATH si es necesario

# Iniciar servidor
npm start

# O en modo desarrollo (con auto-reload)
npm run dev
```

## 📡 Endpoints

### `GET /health`
Health check del servicio.

**Respuesta:**
```json
{
  "status": "ok",
  "service": "image-generator"
}
```

### `POST /generate-image`
Genera una imagen de resultado de partido.

**Body:**
```json
{
  "gameData": {
    "awayTeam": {
      "name": "Buffalo Bills",
      "score": 28
    },
    "homeTeam": {
      "name": "Pittsburgh Steelers",
      "score": 24
    },
    "sport": "nfl",
    "league": "NFL",
    "date": "2024-11-27T00:00:00Z"
  }
}
```

**Respuesta:**
- Content-Type: `image/png`
- Body: Buffer de imagen PNG

## 🚢 Despliegue

### Opción 1: Railway (Recomendado)

1. Crear cuenta en [Railway](https://railway.app)
2. Conectar repositorio o crear nuevo proyecto
3. Agregar variables de entorno:
   - `PORT`: 3001 (o el que Railway asigne)
   - `TEAMS_PATH`: Ruta donde están los logos
4. Railway detectará automáticamente Node.js y ejecutará `npm start`

### Opción 2: Render

1. Crear cuenta en [Render](https://render.com)
2. Crear nuevo "Web Service"
3. Conectar repositorio
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
5. Agregar variables de entorno

### Opción 3: Fly.io

1. Instalar Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Crear app: `fly launch`
4. Desplegar: `fly deploy`

## 🔧 Configuración

### Variables de Entorno

- `PORT`: Puerto del servidor (default: 3001)
- `TEAMS_PATH`: Ruta absoluta donde están los logos de equipos
- `API_KEY`: (Opcional) API key para autenticación

### Estructura de Logos

Los logos deben estar organizados así:
```
public/teams/
  ├── nfl/
  │   ├── BuffaloBills.png
  │   └── ...
  ├── nba/
  │   └── ...
  ├── PremierLeague/
  │   └── ...
  └── generico.png (fallback)
```

## 📝 Uso desde Vercel

En el cron job de Vercel, llamar a esta API:

```typescript
const response = await fetch('https://tu-api.railway.app/generate-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gameData: {
      awayTeam: { name: 'Team A', score: 28 },
      homeTeam: { name: 'Team B', score: 24 },
      sport: 'nfl',
      league: 'NFL',
    },
  }),
});

const imageBuffer = await response.arrayBuffer();
// Guardar en Vercel Blob Storage...
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'canvas'"
- Instalar dependencias del sistema: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` (Linux)
- En macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`

### Error: "Logo not found"
- Verificar que `TEAMS_PATH` apunta a la carpeta correcta
- Verificar que los logos existen en la estructura esperada

### Error: "Port already in use"
- Cambiar `PORT` en `.env` o variable de entorno



