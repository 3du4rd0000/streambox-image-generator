# 📦 Subir Código a GitHub - Paso a Paso

## 📝 Pasos Completos

### Paso 1: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Repository name**: `streambox-image-generator` (o el nombre que prefieras)
3. **Description**: `API externa para generar imágenes de resultados deportivos con Canvas`
4. **Visibility**: 
   - ✅ **Public** (recomendado para plan gratuito)
   - O **Private** (si tienes GitHub Pro)
5. **NO marques**:
   - ❌ Add a README file (ya tenemos uno)
   - ❌ Add .gitignore (ya tenemos uno)
   - ❌ Choose a license
6. Click en **"Create repository"**

### Paso 2: Copiar URL del Repositorio

Después de crear el repo, GitHub te mostrará una URL como:
```
https://github.com/tu-usuario/streambox-image-generator.git
```

**Copia esta URL** - la necesitarás en el siguiente paso.

### Paso 3: Inicializar Git Localmente

Abre tu terminal y ejecuta:

```bash
# 1. Navegar al directorio del servicio
cd /Users/eduardoemouna/Documents/image-generator-service

# 2. Inicializar Git (si no está inicializado)
git init

# 3. Verificar que estás en el directorio correcto
ls -la
# Deberías ver: package.json, src/, public/, etc.
```

### Paso 4: Agregar Archivos

```bash
# Agregar todos los archivos
git add .

# Verificar qué se va a subir
git status
```

### Paso 5: Hacer Primer Commit

```bash
git commit -m "Initial commit: Image generator service for StreamBox"
```

### Paso 6: Conectar con GitHub

```bash
# Reemplaza TU_USUARIO y NOMBRE_REPO con los tuyos
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git

# Verificar que se agregó correctamente
git remote -v
```

### Paso 7: Subir Código

```bash
# Subir a la rama main
git branch -M main
git push -u origin main
```

Si te pide autenticación:
- **Opción A**: Usa tu usuario y un Personal Access Token (no contraseña)
- **Opción B**: Usa GitHub CLI: `gh auth login`

### Paso 8: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos subidos
3. Verifica que `package.json`, `src/`, `public/` estén ahí

## 🔐 Si Necesitas Autenticación

### Crear Personal Access Token (si no tienes uno)

1. Ve a: https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `Image Generator Service`
4. **Expiration**: Elige una fecha (o "No expiration")
5. **Scopes**: Marca `repo` (todos los permisos de repositorio)
6. Click en **"Generate token"**
7. **Copia el token** (solo se muestra una vez)

### Usar el Token

Cuando `git push` te pida contraseña:
- **Username**: Tu usuario de GitHub
- **Password**: Pega el Personal Access Token (no tu contraseña)

## ✅ Checklist

- [ ] Repositorio creado en GitHub
- [ ] URL del repositorio copiada
- [ ] Git inicializado localmente
- [ ] Archivos agregados (`git add .`)
- [ ] Commit realizado
- [ ] Remote agregado (`git remote add origin`)
- [ ] Código subido (`git push`)
- [ ] Verificado en GitHub

## 🚀 Siguiente Paso

Una vez que el código esté en GitHub:
1. Ve a Render
2. "New +" → "Web Service"
3. Conecta con GitHub
4. Selecciona el repositorio que acabas de crear

## 🆘 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
```

### Error: "Authentication failed"
- Usa Personal Access Token en lugar de contraseña
- O configura SSH keys

### Error: "Permission denied"
- Verifica que el repositorio existe
- Verifica que tienes permisos
- Verifica la URL del repositorio

