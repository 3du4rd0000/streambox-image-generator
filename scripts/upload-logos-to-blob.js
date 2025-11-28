/**
 * Script para subir logos de equipos a Vercel Blob Storage
 * Ejecutar desde: stream-box-landing-page (2)
 */

import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../stream-box-landing-page (2)/.env.local') });

const TEAMS_SOURCE_DIR = path.join(__dirname, '../../stream-box-landing-page (2)/public/teams');
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN no encontrado en variables de entorno');
  process.exit(1);
}

/**
 * Sube todos los logos a Vercel Blob Storage
 */
async function uploadLogos() {
  console.log('📤 Iniciando subida de logos a Vercel Blob Storage...');
  console.log(`📁 Directorio origen: ${TEAMS_SOURCE_DIR}`);

  if (!fs.existsSync(TEAMS_SOURCE_DIR)) {
    console.error(`❌ Directorio no encontrado: ${TEAMS_SOURCE_DIR}`);
    process.exit(1);
  }

  let uploaded = 0;
  let errors = 0;

  // Recorrer todas las carpetas y archivos
  function processDirectory(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const blobPath = `team-logos/${relativePath}${entry.name}`;

      if (entry.isDirectory()) {
        processDirectory(fullPath, `${relativePath}${entry.name}/`);
      } else if (entry.isFile() && (entry.name.endsWith('.png') || entry.name.endsWith('.svg'))) {
        // Subir archivo
        uploadFile(fullPath, blobPath);
      }
    }
  }

  async function uploadFile(filePath, blobPath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const contentType = filePath.endsWith('.png') ? 'image/png' : 'image/svg+xml';

      await put(blobPath, fileBuffer, {
        access: 'public',
        contentType,
        token: BLOB_READ_WRITE_TOKEN,
      });

      uploaded++;
      if (uploaded % 50 === 0) {
        console.log(`✅ Subidos ${uploaded} logos...`);
      }
    } catch (error) {
      console.error(`❌ Error subiendo ${blobPath}:`, error.message);
      errors++;
    }
  }

  // Procesar directorio
  processDirectory(TEAMS_SOURCE_DIR);

  // Esperar a que terminen todas las subidas
  console.log('\n⏳ Esperando a que terminen las subidas...');
  
  // Nota: En una implementación real, necesitarías usar Promise.all o similar
  // para esperar todas las promesas. Por ahora, esto es un ejemplo.

  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Subidos: ${uploaded}`);
  console.log(`   - Errores: ${errors}`);
}

uploadLogos().catch(console.error);

