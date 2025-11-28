# 🚀 Desplegar con Railway CLI - Pasos Manuales

## ✅ Railway CLI ya está instalado

## 📝 Pasos a Ejecutar

### Paso 1: Abrir Terminal y Navegar
```bash
cd /Users/eduardoemouna/Documents/image-generator-service
```

### Paso 2: Agregar Railway al PATH (si es necesario)
```bash
export PATH="$HOME/.railway/bin:$PATH"
```

### Paso 3: Login en Railway
```bash
railway login
```
Esto abrirá tu navegador para autenticarte. Haz clic en "Authorize" cuando aparezca.

### Paso 4: Inicializar Proyecto
```bash
railway init
```
Cuando te pregunte:
- **"Would you like to create a new project or link to an existing one?"** → Selecciona el proyecto "helpful-intuition" que ya creaste
- **"Would you like to create a new environment?"** → Puedes usar "production" o crear uno nuevo

### Paso 5: Configurar Variables de Entorno
```bash
railway variables --set "PORT=3001"
railway variables --set "TEAMS_PATH=/app/public/teams"
```

### Paso 6: Desplegar
```bash
railway up
```

Esto subirá el código y desplegará el servicio. Railway te dará una URL al finalizar.

### Paso 7: Obtener URL
```bash
railway domain
```
O revisa en el dashboard de Railway.

## 🔍 Verificar Despliegue

```bash
# Health check
curl https://tu-url.railway.app/health

# Debería responder: {"status":"ok","service":"image-generator"}
```

## 📝 Notas

- Los logos ya están en `public/teams/` y se incluirán en el despliegue
- Railway detectará automáticamente que es Node.js
- El servicio se iniciará con `npm start`

## 🆘 Si hay problemas

```bash
# Ver logs
railway logs

# Ver estado
railway status
```

