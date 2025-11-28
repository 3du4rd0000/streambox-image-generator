/**
 * Servidor Express para generar imágenes de resultados deportivos
 * Usa Canvas para generar imágenes programáticamente
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMatchResultImage } from './image-generator.js';

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Image Generator Service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 Generate image: POST http://localhost:${PORT}/generate-image`);
});

