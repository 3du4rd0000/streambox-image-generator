# ✅ Configuración Final para Render

## 📝 Campos a Configurar

### Build Command
**Cambiar de:** `$ yarn install`  
**A:** `npm install`

### Start Command
**Ya está correcto:** `$ node src/server.js` ✅

### Environment Variables
Agregar estas dos variables:

1. **PORT**
   - Name: `PORT`
   - Value: `10000`
   - (Render asigna el puerto automáticamente, pero el código ya usa `process.env.PORT`)

2. **TEAMS_PATH**
   - Name: `TEAMS_PATH`
   - Value: `/opt/render/project/src/public/teams`

### Instance Type
- **Free** está bien para empezar ✅
- Si necesitas más recursos después, puedes actualizar a Starter ($9/mes)

## 🚀 Después de Crear el Servicio

1. Render comenzará a desplegar automáticamente
2. Espera 2-5 minutos
3. Obtendrás una URL como: `https://streambox-image-generator.onrender.com`
4. Verifica con: `curl https://tu-url.onrender.com/health`

## ⚠️ Nota sobre Logos

Los logos NO están en GitHub, pero están en tu máquina local. Para Render:

**Opción A**: Subir logos después usando SSH o Render Volumes  
**Opción B**: Configurar `TEAMS_PATH` para apuntar a otro lugar  
**Opción C**: Usar un servicio de almacenamiento externo (S3, Cloudinary, etc.)

Por ahora, el servicio funcionará pero no encontrará los logos. Podemos configurarlos después.



