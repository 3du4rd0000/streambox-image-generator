# Instrucciones para Agregar Imagen de Fondo

## Ubicación del Archivo

Coloca tu imagen de fondo en:
```
public/backgrounds/match-result-background.png
```

## Especificaciones de la Imagen

- **Dimensiones**: 1080x1080 píxeles (o proporcional)
- **Formato**: PNG (con transparencia si es necesario)
- **Contenido**: 
  - Fondo con gradiente rojo/azul de StreamBox (#E41E26 y #0052A5)
  - Texto "FINAL" en la parte inferior
  - Texto "VS" en el centro
  - Título de liga (opcional, o se dibuja dinámicamente)
  - Espacios reservados para:
    - Logos de equipos (izquierda y derecha)
    - Marcadores (debajo de cada logo)

## Elementos que se Dibujan Programáticamente

El código ahora solo dibuja:
1. **Logos de equipos** (200x200 píxeles cada uno)
2. **Marcadores** (números grandes, 120px, color rojo #E41E26)
3. **Título de liga** (si no está en la imagen de fondo)

## Si No Hay Imagen de Fondo

Si no existe `match-result-background.png`, el código usará un gradiente como fallback y dibujará todos los elementos (VS, FINAL, etc.) programáticamente.

## Cómo Subir la Imagen

1. Diseña la imagen en tu editor favorito (Figma, Photoshop, etc.)
2. Guárdala como `match-result-background.png`
3. Colócala en `public/backgrounds/`
4. Haz commit y push:
   ```bash
   git add public/backgrounds/match-result-background.png
   git commit -m "Add background image for match results"
   git push origin main
   ```
5. Render detectará el cambio y hará redeploy automáticamente

## Notas

- La imagen se escalará automáticamente al tamaño del canvas (1080x1080)
- Los logos se dibujan en las posiciones: izquierda (x=300) y derecha (x=780), y=250
- Los marcadores se dibujan debajo de los logos, aproximadamente en y=400

