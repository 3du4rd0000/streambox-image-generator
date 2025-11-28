# Limpiar Repositorio de Archivos Grandes

## Problema
GitHub rechaza los pushes porque hay archivos grandes (logos) en el historial de Git.

## Solución: Limpiar Historial

### Opción 1: Usar git filter-repo (Recomendado)

```bash
# Instalar git-filter-repo si no lo tienes
brew install git-filter-repo

# Eliminar public/teams/ del historial completo
git filter-repo --path public/teams --invert-paths

# Eliminar archivos .tar.gz del historial
git filter-repo --path-glob '*.tar.gz' --invert-paths

# Forzar push (CUIDADO: esto reescribe el historial)
git push origin --force --all
```

### Opción 2: Crear un Repositorio Nuevo (Más Simple)

Si el historial no es crítico, puedes:

1. Crear un nuevo repositorio en GitHub
2. Copiar solo los archivos necesarios (sin logos)
3. Hacer push del nuevo repositorio limpio

```bash
# En el directorio del proyecto
cd ..
mkdir image-generator-service-clean
cd image-generator-service-clean

# Copiar archivos (excluyendo logos y .git)
rsync -av --exclude='public/teams' --exclude='.git' --exclude='*.tar.gz' ../image-generator-service/ .

# Inicializar nuevo repo
git init
git add .
git commit -m "Initial commit - clean repository without logos"
git remote add origin <NUEVA_URL_DEL_REPO>
git push -u origin main
```

### Opción 3: Usar BFG Repo-Cleaner

```bash
# Descargar BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Eliminar archivos grandes
java -jar bfg.jar --delete-folders public/teams
java -jar bfg.jar --delete-files *.tar.gz

# Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Forzar push
git push origin --force --all
```

## Verificación

Después de limpiar, verifica el tamaño:

```bash
git count-objects -vH
du -sh .git
```

## Nota Importante

⚠️ **ADVERTENCIA**: Limpiar el historial reescribe el repositorio. Si otros colaboradores tienen clones del repo, necesitarán hacer:

```bash
git fetch origin
git reset --hard origin/main
```

## Estado Actual

- ✅ `.gitignore` actualizado para excluir `public/teams/` y `*.tar.gz`
- ✅ Logos eliminados del índice de Git
- ✅ El código está configurado para descargar logos desde Vercel Blob Storage
- ⚠️ El historial de Git aún contiene los archivos grandes (necesita limpieza)

