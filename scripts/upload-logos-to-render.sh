#!/bin/bash

# Script para subir logos a Render usando rsync o scp
# Requiere tener acceso SSH configurado en Render

SERVICE_URL="streambox-image-generator.onrender.com"
SOURCE_DIR="/Users/eduardoemouna/Documents/image-generator-service/public/teams"
DEST_DIR="/opt/render/project/src/public/teams"

echo "📤 Subiendo logos a Render..."
echo "Origen: $SOURCE_DIR"
echo "Destino: $DEST_DIR en $SERVICE_URL"

# Método 1: Usar rsync (si Render permite SSH)
# Necesitarás la información de SSH de Render
# rsync -avz --progress "$SOURCE_DIR/" "render@$SERVICE_URL:$DEST_DIR/"

# Método 2: Comprimir y subir manualmente
echo ""
echo "📦 Comprimiendo logos..."
cd /Users/eduardoemouna/Documents/image-generator-service
tar -czf teams-logos.tar.gz public/teams/

echo ""
echo "✅ Archivo comprimido: teams-logos.tar.gz"
echo ""
echo "📝 Próximos pasos:"
echo "1. Ve a Render Dashboard → Shell"
echo "2. Ejecuta: mkdir -p /opt/render/project/src/public/teams"
echo "3. Sube teams-logos.tar.gz usando el método que Render permita"
echo "4. En Render Shell, ejecuta: tar -xzf teams-logos.tar.gz -C /opt/render/project/src/public/"
echo ""
echo "O usa el método de Git LFS (ver SUBIR_LOGOS_RENDER.md)"



