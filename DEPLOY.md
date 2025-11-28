# 🚀 Guía de Despliegue - Image Generator Service

## 📋 Requisitos Previos

1. **Logos de equipos**: Copiar desde `streamboxtv/public/teams/` a `public/teams/` en el servicio
2. **Cuenta en plataforma de despliegue**: Railway, Render, o Fly.io
3. **Node.js 18+** en la plataforma

## 🚂 Opción 1: Railway (Recomendado - Más Fácil)

### Paso 1: Crear Proyecto
1. Ve a [railway.app](https://railway.app)
2. Crea cuenta o inicia sesión
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo" o "Empty Project"

### Paso 2: Configurar
1. Si usas GitHub:
   - Conecta tu repositorio
   - Railway detectará automáticamente Node.js
2. Si usas "Empty Project":
   - Click en "Add Service" → "GitHub Repo"
   - Selecciona el repositorio con el servicio

### Paso 3: Variables de Entorno
En Railway Dashboard → Variables:
```
PORT=3001
TEAMS_PATH=/app/public/teams
```

### Paso 4: Subir Logos
**Opción A: Usar Railway Volumes**
1. En Railway → Volumes → Add Volume
2. Montar en `/app/public/teams`
3. Subir logos manualmente o vía CLI

**Opción B: Incluir en Git**
1. Copiar logos a `public/teams/` en el repositorio
2. Hacer commit y push
3. Railway los incluirá en el build

### Paso 5: Desplegar
Railway desplegará automáticamente. Obtendrás una URL como:
```
https://image-generator-production.up.railway.app
```

## 🎨 Opción 2: Render

### Paso 1: Crear Servicio
1. Ve a [render.com](https://render.com)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio GitHub

### Paso 2: Configurar Build
- **Name**: `streambox-image-generator`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (o pago si necesitas más recursos)

### Paso 3: Variables de Entorno
En Environment Variables:
```
PORT=10000
TEAMS_PATH=/opt/render/project/src/public/teams
```

### Paso 4: Subir Logos
1. Usar Render Disk para almacenar logos persistentes
2. O incluir logos en el repositorio Git

### Paso 5: Desplegar
Click en "Create Web Service". Render desplegará y te dará una URL.

## ✈️ Opción 3: Fly.io

### Paso 1: Instalar CLI
```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Paso 2: Crear App
```bash
cd image-generator-service
fly launch
```

### Paso 3: Configurar fly.toml
```toml
[env]
  PORT = "8080"
  TEAMS_PATH = "/app/public/teams"
```

### Paso 4: Desplegar
```bash
fly deploy
```

## 🔧 Configuración Post-Despliegue

### 1. Verificar Health Check
```bash
curl https://tu-url.com/health
```
Debería responder: `{"status":"ok","service":"image-generator"}`

### 2. Probar Generación de Imagen
```bash
curl -X POST https://tu-url.com/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "gameData": {
      "awayTeam": {"name": "Buffalo Bills", "score": 28},
      "homeTeam": {"name": "Pittsburgh Steelers", "score": 24},
      "sport": "nfl",
      "league": "NFL"
    }
  }' \
  --output test-image.png
```

### 3. Actualizar Variable en Vercel
En Vercel Dashboard → Settings → Environment Variables:
```
IMAGE_GENERATOR_API_URL=https://tu-url.com
```

## 📝 Actualizar Cron Job de Vercel

Ver `docs/backend/ACTUALIZAR_CRON_VERCEL.md` para instrucciones de actualizar el cron job.

## 🐛 Troubleshooting

### Error: "Cannot find module 'canvas'"
**Railway/Render**: Instalar dependencias del sistema automáticamente (usualmente funciona)
**Fly.io**: Agregar en `fly.toml`:
```toml
[build]
  buildpacks = ["heroku/nodejs"]
```

### Error: "Logo not found"
- Verificar que `TEAMS_PATH` es correcta
- Verificar que los logos están en la estructura esperada
- Revisar logs del servidor para ver qué ruta está buscando

### Error: "Port already in use"
- Cambiar `PORT` en variables de entorno
- Railway/Render asignan puerto automáticamente, usar `process.env.PORT`

## 💰 Costos Estimados

- **Railway**: $5/mes (Hobby plan) o Free con límites
- **Render**: Free tier disponible, $7/mes para más recursos
- **Fly.io**: Free tier generoso, pago por uso después

## ✅ Checklist Final

- [ ] Servicio desplegado y accesible
- [ ] Health check responde correctamente
- [ ] Logos de equipos disponibles
- [ ] Prueba de generación de imagen funciona
- [ ] Variable `IMAGE_GENERATOR_API_URL` configurada en Vercel
- [ ] Cron job actualizado para usar la API externa

