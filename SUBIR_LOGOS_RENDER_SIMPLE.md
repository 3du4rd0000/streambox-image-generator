# 🚀 Subir Logos a Render - Método Simple

## ✅ Archivo Listo
El archivo `teams-logos.tar.gz` (46MB) está listo en:
```
/Users/eduardoemouna/Documents/image-generator-service/teams-logos.tar.gz
```

## 📋 Pasos en Render Dashboard

### 1. Abre Render Dashboard
- Ve a: https://dashboard.render.com
- Selecciona el servicio: **streambox-image-generator**

### 2. Abre Shell
- En el menú lateral izquierdo, haz clic en **"Shell"**
- Se abrirá una terminal en el navegador

### 3. En Render Shell, ejecuta estos comandos:

```bash
# Crear directorio para logos
mkdir -p /opt/render/project/src/public/teams
cd /opt/render/project/src/public
```

### 4. Subir el archivo

**Opción A: Si Render Shell tiene botón "Upload File"**
- Haz clic en "Upload File" o similar
- Selecciona `teams-logos.tar.gz` desde tu Mac
- Espera a que termine la subida

**Opción B: Usar método de arrastrar y soltar**
- Algunas shells de Render permiten arrastrar archivos
- Arrastra `teams-logos.tar.gz` a la ventana de Shell

**Opción C: Usar base64 (si las opciones anteriores no funcionan)**
- Ver instrucciones en `SUBIR_LOGOS_BASE64.md`

### 5. Extraer los logos

Una vez que el archivo esté en Render, ejecuta:

```bash
# Verificar que el archivo está ahí
ls -lh teams-logos.tar.gz

# Extraer logos
tar -xzf teams-logos.tar.gz -C /opt/render/project/src/public/

# Verificar que se extrajeron correctamente
ls -la /opt/render/project/src/public/teams/

# Deberías ver carpetas como: nfl, nba, mlb, soccer, etc.

# Limpiar archivo comprimido
rm teams-logos.tar.gz
```

### 6. Reiniciar el Servicio

- En Render Dashboard, ve a **"Events"** o **"Manual Deploy"**
- Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**
- O simplemente espera a que Render detecte cambios y haga redeploy automático

## ✅ Verificar que Funciona

Después del redeploy, prueba el endpoint:

```bash
curl https://streambox-image-generator.onrender.com/health
```

Debería responder: `{"status":"ok","service":"image-generator"}`

## 🎯 Listo!

Los logos ahora están en Render y el servicio puede usarlos para generar imágenes.

