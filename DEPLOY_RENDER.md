# 🚀 Desplegar en Render - Guía Completa

## ✅ Ventajas de Render
- Plan gratuito disponible
- Auto-deploy desde GitHub
- Fácil configuración
- Perfecto para servicios Node.js

## 📝 Pasos Detallados

### Paso 1: Subir Código a GitHub (Si no está)

```bash
cd /Users/eduardoemouna/Documents/image-generator-service

# Inicializar Git
git init
git add .
git commit -m "Image generator service"

# Crear repo en GitHub y hacer push
# O usar GitHub Desktop
```

### Paso 2: Crear Cuenta en Render

1. Ve a: https://render.com
2. Click en "Get Started for Free"
3. Conecta con GitHub (recomendado)

### Paso 3: Crear Web Service

1. En Render Dashboard, click en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio GitHub
https://github.com/3du4rd0000/streambox-image-generator
4. Selecciona el repositorio con `image-generator-service`

### Paso 4: Configurar Servicio

**Configuración básica:**
- **Name**: `streambox-image-generator`
- **Region**: Elige el más cercano (US East, US West, etc.)
- **Branch**: `main` o `master`
- **Root Directory**: (dejar vacío, o `image-generator-service` si está en subdirectorio)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: **Free** (o Starter si necesitas más recursos)

### Paso 5: Variables de Entorno

En la sección "Environment Variables", agrega:

```
PORT=10000
TEAMS_PATH=/opt/render/project/src/public/teams
```

**Nota**: Render asigna el puerto automáticamente, pero puedes usar `process.env.PORT` en el código.

### Paso 6: Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a desplegar automáticamente
3. Espera a que termine (2-5 minutos)
4. Obtendrás una URL como: `https://streambox-image-generator.onrender.com`

### Paso 7: Verificar

```bash
# Health check
curl https://tu-url.onrender.com/health

# Debería responder: {"status":"ok","service":"image-generator"}
```

### Paso 8: Configurar en Vercel

En **Vercel Dashboard → Settings → Environment Variables**:
```
IMAGE_GENERATOR_API_URL=https://tu-url.onrender.com
```

## 🔧 Ajustar Código para Render

Render asigna el puerto automáticamente. Asegúrate de que `server.js` use:

```javascript
const PORT = process.env.PORT || 3001;
```

Ya está configurado así ✅

## ⚠️ Nota sobre Plan Gratuito de Render

- El servicio puede "dormir" después de 15 minutos de inactividad
- El primer request después de dormir puede tardar ~30 segundos
- Para evitar esto, puedes usar un servicio de "ping" o actualizar a Starter ($7/mes)

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que `package.json` tenga `"start": "node src/server.js"`
- Revisa los logs en Render Dashboard

### Error: "Port already in use"
- Render asigna el puerto automáticamente
- Usa `process.env.PORT` (ya está configurado)

### Error: "Logos not found"
- Verifica que los logos estén en `public/teams/` en el repositorio
- Verifica la ruta `TEAMS_PATH`

## ✅ Checklist

- [ ] Código subido a GitHub
- [ ] Cuenta creada en Render
- [ ] Web Service creado
- [ ] Variables de entorno configuradas
- [ ] Despliegue exitoso
- [ ] Health check funciona
- [ ] URL agregada en Vercel como `IMAGE_GENERATOR_API_URL`



