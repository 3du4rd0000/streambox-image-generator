# 📤 Subir Logos Manualmente a Render

## ✅ Archivo Comprimido Listo
Se ha creado `teams-logos.tar.gz` con todos los logos (48MB comprimidos).

## 🚀 Pasos para Subir a Render

### Opción A: Usar Render Shell (Recomendado)

1. **Ve a Render Dashboard:**
   - https://dashboard.render.com
   - Selecciona el servicio `streambox-image-generator`

2. **Abre Shell:**
   - En el menú lateral, haz clic en **"Shell"**
   - Se abrirá una terminal en el navegador

3. **En Render Shell, ejecuta:**
   ```bash
   # Crear directorio
   mkdir -p /opt/render/project/src/public/teams
   cd /opt/render/project/src/public
   ```

4. **Subir el archivo:**
   - Render Shell puede tener opción de "Upload File" o similar
   - O usa el método de copiar/pegar base64 (ver abajo)

### Opción B: Usar Base64 (Si Render Shell no permite upload directo)

En tu Mac, ejecuta:
```bash
cd /Users/eduardoemouna/Documents/image-generator-service
base64 teams-logos.tar.gz > teams-logos-base64.txt
```

Luego en Render Shell:
```bash
# Pegar el contenido de teams-logos-base64.txt
cat > teams-logos-base64.txt << 'EOF'
[PEGAR AQUÍ EL CONTENIDO DEL ARCHIVO]
EOF

# Decodificar y extraer
base64 -d teams-logos-base64.txt > teams-logos.tar.gz
tar -xzf teams-logos.tar.gz -C /opt/render/project/src/public/
rm teams-logos.tar.gz teams-logos-base64.txt
```

### Opción C: Usar rsync/SCP (Si tienes acceso SSH)

```bash
# Desde tu Mac
cd /Users/eduardoemouna/Documents/image-generator-service
scp teams-logos.tar.gz render@streambox-image-generator.onrender.com:/tmp/

# Luego en Render Shell
tar -xzf /tmp/teams-logos.tar.gz -C /opt/render/project/src/public/
```

## ✅ Verificar

Después de subir, en Render Shell:
```bash
ls -la /opt/render/project/src/public/teams/
# Deberías ver las carpetas: nfl, nba, mlb, etc.
```

## 🔄 Reiniciar Servicio

Después de subir los logos, reinicia el servicio en Render Dashboard para que los detecte.



