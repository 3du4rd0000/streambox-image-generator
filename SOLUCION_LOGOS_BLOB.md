# 🎯 Solución: Logos en Vercel Blob Storage

## 📋 Problema
- GitHub rechaza archivos > 50MB
- Render plan gratuito no tiene Shell
- Los logos son 48MB (507 archivos)

## ✅ Solución Implementada
Subir logos a **Vercel Blob Storage** y que Render los descargue automáticamente al iniciar.

## 🚀 Pasos para Implementar

### Paso 1: Subir Logos a Vercel Blob Storage

Desde el proyecto principal (`stream-box-landing-page (2)`):

```bash
cd /Users/eduardoemouna/Documents/stream-box-landing-page\ \(2\)

# Asegúrate de tener BLOB_READ_WRITE_TOKEN en .env.local
node scripts/upload-logos-to-blob.js
```

Este script:
- Lee todos los logos de `public/teams/`
- Los sube a Vercel Blob Storage con prefijo `team-logos/`
- Mantiene la estructura de carpetas (nfl/, nba/, soccer/, etc.)

### Paso 2: Configurar Variable de Entorno en Render

1. Ve a Render Dashboard → `streambox-image-generator`
2. Settings → Environment Variables
3. Agregar:
   ```
   BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
   ```

### Paso 3: Actualizar Código en GitHub

```bash
cd /Users/eduardoemouna/Documents/image-generator-service

# Remover logos del commit (mantener solo código)
git reset HEAD~1
git rm -r --cached public/teams/
git commit -m "Remove logos from repo, use Vercel Blob instead"

# Agregar cambios del servidor
git add src/server.js src/download-logos.js package.json
git commit -m "Add automatic logo download from Vercel Blob"
git push origin main
```

### Paso 4: Render Descargará Automáticamente

Cuando Render haga redeploy:
1. El servicio iniciará
2. Verificará si los logos existen localmente
3. Si no existen, los descargará desde Vercel Blob Storage
4. Los guardará en `/opt/render/project/src/public/teams/`

## 📁 Estructura de Archivos

```
image-generator-service/
├── src/
│   ├── server.js              # Modificado: descarga logos al iniciar
│   ├── download-logos.js      # Nuevo: lógica de descarga
│   └── image-generator.js     # Usa logos locales
└── package.json               # Agregado: @vercel/blob

stream-box-landing-page (2)/
└── scripts/
    └── upload-logos-to-blob.js  # Nuevo: script para subir logos
```

## ✅ Ventajas de Esta Solución

1. ✅ **No requiere Git LFS** (complicado de instalar)
2. ✅ **No requiere Shell en Render** (plan gratuito)
3. ✅ **Automático**: Render descarga logos al iniciar
4. ✅ **Usa infraestructura existente**: Vercel Blob Storage
5. ✅ **Eficiente**: Solo descarga si no existen localmente

## 🔄 Flujo Completo

1. **Desarrollo local**: Logos en `public/teams/` (no en Git)
2. **Subir a Blob**: Ejecutar `upload-logos-to-blob.js` cuando cambien logos
3. **Render inicia**: Descarga logos automáticamente
4. **Generación de imágenes**: Usa logos descargados localmente

## 🧪 Verificar que Funciona

Después del deploy en Render:

```bash
# Health check
curl https://streambox-image-generator.onrender.com/health

# Ver logs de Render para confirmar descarga de logos
# Deberías ver: "✅ Logos descargados exitosamente."
```

## 📝 Notas

- Los logos se descargan **solo una vez** al iniciar el servicio
- Si Render reinicia, volverá a descargar (pero es rápido)
- Los logos se guardan en el sistema de archivos de Render (temporal)
- Si necesitas actualizar logos, vuelve a ejecutar `upload-logos-to-blob.js`

