# ✅ Comandos Correctos para Railway CLI

## 📝 Ejecuta en este orden:

### 1. Navegar al directorio
```bash
cd /Users/eduardoemouna/Documents/image-generator-service
export PATH="$HOME/.railway/bin:$PATH"
```

### 2. Login (si no lo has hecho)
```bash
railway login
```

### 3. Vincular al proyecto existente
```bash
railway link
```
Cuando te pregunte, selecciona el proyecto "helpful-intuition"

### 4. Crear servicio (si no existe)
```bash
railway service
```
Esto creará un nuevo servicio en tu proyecto.

### 5. Configurar Variables de Entorno
```bash
railway variables --set "PORT=3001"
railway variables --set "TEAMS_PATH=/app/public/teams"
```

### 6. Desplegar
```bash
railway up
```

## 🔍 Verificar

```bash
# Ver variables configuradas
railway variables

# Ver estado
railway status

# Ver logs
railway logs
```

## 📝 Nota

Si `railway link` no encuentra el proyecto, puedes usar:
```bash
railway init
```
Y crear un nuevo servicio directamente.

