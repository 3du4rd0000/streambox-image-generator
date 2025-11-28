#!/bin/bash
# Script para limpiar el historial de Git de archivos grandes

echo "🧹 Limpiando historial de Git de archivos grandes..."

# Verificar si git-filter-repo está instalado
if ! command -v git-filter-repo &> /dev/null; then
    echo "❌ git-filter-repo no está instalado."
    echo "📦 Instálalo con: brew install git-filter-repo"
    echo "   O con pip: pip install git-filter-repo"
    exit 1
fi

# Crear backup del branch actual
echo "💾 Creando backup..."
git branch backup-before-cleanup

# Eliminar public/teams/ del historial
echo "🗑️  Eliminando public/teams/ del historial..."
git filter-repo --path public/teams --invert-paths --force

# Eliminar archivos .tar.gz del historial
echo "🗑️  Eliminando archivos .tar.gz del historial..."
git filter-repo --path-glob '*.tar.gz' --invert-paths --force

# Limpiar referencias
echo "🧹 Limpiando referencias..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Mostrar nuevo tamaño
echo ""
echo "✅ Limpieza completada!"
echo "📊 Nuevo tamaño del repositorio:"
git count-objects -vH

echo ""
echo "⚠️  IMPORTANTE: Ahora necesitas hacer force push:"
echo "   git push origin --force --all"
echo ""
echo "⚠️  Si otros tienen clones del repo, necesitarán:"
echo "   git fetch origin"
echo "   git reset --hard origin/main"

