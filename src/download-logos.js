/**
 * Script para descargar logos desde Vercel Blob Storage
 * Se ejecuta al iniciar el servicio en Render
 */

import fs from 'fs';
import path from 'path';
import { list } from '@vercel/blob';

const TEAMS_PATH = process.env.TEAMS_PATH || path.join(process.cwd(), 'public', 'teams');
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Descarga todos los logos desde Vercel Blob Storage
 */
export async function downloadLogosFromBlob() {
  if (!BLOB_READ_WRITE_TOKEN) {
    console.warn('[DownloadLogos] BLOB_READ_WRITE_TOKEN no configurado. Usando logos locales si existen.');
    return false;
  }

  try {
    console.log('[DownloadLogos] Iniciando descarga de logos desde Vercel Blob...');
    
    // Crear directorio si no existe
    if (!fs.existsSync(TEAMS_PATH)) {
      fs.mkdirSync(TEAMS_PATH, { recursive: true });
      console.log(`[DownloadLogos] Directorio creado: ${TEAMS_PATH}`);
    }

    // Listar todos los blobs con prefijo "team-logos/"
    const { blobs } = await list({
      prefix: 'team-logos/',
      token: BLOB_READ_WRITE_TOKEN,
    });

    if (blobs.length === 0) {
      console.warn('[DownloadLogos] No se encontraron logos en Blob Storage.');
      return false;
    }

    console.log(`[DownloadLogos] Encontrados ${blobs.length} logos para descargar.`);

    let downloaded = 0;
    let skipped = 0;

    for (const blob of blobs) {
      try {
        // Extraer ruta relativa (ej: "team-logos/nfl/BuffaloBills.png" -> "nfl/BuffaloBills.png")
        const relativePath = blob.pathname.replace('team-logos/', '');
        const filePath = path.join(TEAMS_PATH, relativePath);
        const dirPath = path.dirname(filePath);

        // Crear directorio si no existe
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Descargar archivo
        const response = await fetch(blob.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        
        downloaded++;
        
        if (downloaded % 50 === 0) {
          console.log(`[DownloadLogos] Descargados ${downloaded}/${blobs.length} logos...`);
        }
      } catch (error) {
        console.error(`[DownloadLogos] Error descargando ${blob.pathname}:`, error.message);
        skipped++;
      }
    }

    console.log(`[DownloadLogos] ✅ Descarga completada: ${downloaded} descargados, ${skipped} omitidos.`);
    return downloaded > 0;

  } catch (error) {
    console.error('[DownloadLogos] Error general:', error.message);
    return false;
  }
}

/**
 * Verifica si los logos ya están descargados localmente
 */
export function logosExistLocally() {
  if (!fs.existsSync(TEAMS_PATH)) {
    return false;
  }

  // Verificar que hay al menos algunas carpetas de deportes
  const entries = fs.readdirSync(TEAMS_PATH, { withFileTypes: true });
  const directories = entries.filter(e => e.isDirectory());
  
  return directories.length > 0;
}

