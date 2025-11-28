# 📤 Subir Logos a Render - Guía Paso a Paso

## 🎯 Objetivo
Subir los logos desde tu máquina local (`public/teams/`) a Render para que el servicio pueda usarlos.

## ✅ Opción 1: Usar Render Shell (Recomendado - Más Fácil)

### Paso 1: Abrir Shell en Render
1. Ve a Render Dashboard
2. Selecciona el servicio `streambox-image-generator`
3. En el menú lateral, haz clic en **"Shell"**
4. Se abrirá una terminal en el navegador

### Paso 2: Crear Directorio
En la Shell de Render, ejecuta:
```bash
mkdir -p /opt/render/project/src/public/teams
cd /opt/render/project/src/public/teams
pwd
# Debería mostrar: /opt/render/project/src/public/teams
```

### Paso 3: Subir Logos desde tu Máquina
Abre una terminal en tu Mac y ejecuta:

```bash
cd /Users/eduardoemouna/Documents/image-generator-service

# Usar scp para subir (necesitarás la información de SSH de Render)
# O mejor, usar el método de tar + base64
```

**Método Alternativo - Usar tar y base64:**

```bash
# En tu Mac: Comprimir los logos
cd /Users/eduardoemouna/Documents/image-generator-service
tar -czf teams.tar.gz public/teams/

# En Render Shell: Crear directorio y preparar para recibir
mkdir -p /opt/render/project/src/public
```

Luego copia el archivo usando el método que Render permita.

## ✅ Opción 2: Usar Git LFS (Subir a GitHub)

### Paso 1: Instalar Git LFS
```bash
brew install git-lfs
```

### Paso 2: Configurar Git LFS
```bash
cd /Users/eduardoemouna/Documents/image-generator-service
git lfs install
git lfs track "public/teams/**/*.png"
git lfs track "public/teams/**/*.svg"
```

### Paso 3: Agregar y Subir
```bash
# Actualizar .gitignore para permitir logos con LFS
# (remover public/teams/ de .gitignore temporalmente)

git add .gitattributes
git add public/teams/
git commit -m "Add team logos with Git LFS"
git push origin main
```

### Paso 4: Render los Descargará Automáticamente
Render detectará el cambio y hará redeploy automáticamente.

## ✅ Opción 3: Usar Render Disk (Persistent Storage)

1. En Render Dashboard → **Disk**
2. Crear un nuevo disk persistente
3. Montar en `/opt/render/project/src/public/teams`
4. Subir logos usando SSH o el método que prefieras

## 🎯 Recomendación: Opción 1 (Render Shell)

Es la más directa. Te guío paso a paso:



