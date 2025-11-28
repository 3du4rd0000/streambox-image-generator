/**
 * Servidor Express para generar imágenes de resultados deportivos
 * Usa Canvas para generar imágenes programáticamente
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMatchResultImage } from './image-generator.js';
import { downloadLogosFromBlob, logosExistLocally } from './download-logos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'image-generator' });
});

// Endpoint principal: Generar imagen de resultado de partido
app.post('/generate-image', async (req, res) => {
  try {
    const { gameData } = req.body;

    if (!gameData) {
      return res.status(400).json({ 
        error: 'Missing required parameter: gameData' 
      });
    }

    // Validar estructura básica
    if (!gameData.awayTeam || !gameData.homeTeam || !gameData.sport) {
      return res.status(400).json({ 
        error: 'Invalid gameData structure. Required: awayTeam, homeTeam, sport' 
      });
    }

    console.log(`[API] Generating image for: ${gameData.awayTeam.name} vs ${gameData.homeTeam.name}`);

    // Generar imagen
    const imageBuffer = await generateMatchResultImage(gameData);

    // Enviar imagen como PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', imageBuffer.length);
    res.send(imageBuffer);

    console.log(`[API] Image generated successfully (${imageBuffer.length} bytes)`);

  } catch (error) {
    console.error('[API] Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
});

// Inicializar logos antes de iniciar el servidor
async function initializeService() {
  // Verificar si los logos ya existen localmente
  if (logosExistLocally()) {
    console.log('✅ Logos encontrados localmente, omitiendo descarga.');
  } else {
    console.log('📥 Logos no encontrados localmente, descargando desde Vercel Blob...');
    const downloaded = await downloadLogosFromBlob();
    if (downloaded) {
      console.log('✅ Logos descargados exitosamente.');
    } else {
      console.warn('⚠️ No se pudieron descargar logos. El servicio funcionará con logos genéricos si están disponibles.');
    }
  }

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Image Generator Service running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🎨 Generate image: POST http://localhost:${PORT}/generate-image`);
  });
}

// Inicializar servicio
initializeService().catch(console.error);



