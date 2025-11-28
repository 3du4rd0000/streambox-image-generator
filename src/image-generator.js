/**
 * Generador de imágenes programáticas usando Canvas
 * Versión para servicio externo (sin restricciones de Turbopack)
 */

import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DEFAULT_OPTIONS = {
  width: 1080,
  height: 1080,
  quality: 100,
};

// Mapeo de deportes a carpetas (simplificado, se puede expandir)
const SPORT_TO_FOLDER = {
  nfl: 'nfl',
  nba: 'nba',
  mlb: 'mlb',
  nhl: 'nhl',
  soccer: 'PremierLeague', // Default, se puede sobreescribir por liga
  ncaafb: 'ncaafb',
  ncaabb: 'ncaabb',
};

// Mapeo de ligas de fútbol a carpetas
const SOCCER_LEAGUE_TO_FOLDER = {
  'Premier League': 'PremierLeague',
  'English Premier League': 'PremierLeague',
  'La Liga': 'laliga',
  'Spanish La Liga': 'laliga',
  'Primera División': 'laliga',
  'Serie A': 'SerieA',
  'Italian Serie A': 'SerieA',
  'Bundesliga': 'Bundesliga',
  'German Bundesliga': 'Bundesliga',
  'Ligue 1': 'Ligue1',
  'French Ligue 1': 'Ligue1',
  'Liga MX': 'ligamx',
  'Liga BBVA MX': 'ligamx',
  'MLS': 'mls',
  'Major League Soccer': 'mls',
  'LPF': 'LPF',
  'Liga Profesional': 'LPF',
  'UEFA Champions League': 'championsyeuropa',
  'Champions League': 'championsyeuropa',
  'UCL': 'championsyeuropa',
};

// Mapeo explícito de nombres de equipos a nombres de archivos (para casos especiales)
const TEAM_NAME_TO_FILENAME = {
  // NFL
  'kansas city chiefs': 'KansasCityChiefs',
  'kansas city': 'KansasCityChiefs',
  'chiefs': 'KansasCityChiefs',
  'green bay packers': 'GreenBayPackers',
  'detroit lions': 'DetroitLions',
  'dallas cowboys': 'DallasCowboys',
  'pittsburgh steelers': 'PittsburghSteelers',
  'buffalo bills': 'BuffaloBills',
  // MLB
  'los angeles dodgers': 'LosAngelesDodgers',
  'toronto blue jays': 'TorontoBlueJays',
  // Agregar más según sea necesario
};

/**
 * Normaliza el nombre del equipo para buscar el logo
 * NO elimina palabras importantes como "city", "chiefs", etc.
 */
function normalizeTeamName(teamName) {
  return teamName
    .toLowerCase()
    .replace(/\b(fc|cf|sc|deportivo|club|team|united|athletic|real|inter|ac|borussia)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Busca el logo de un equipo
 */
function findTeamLogo(teamName, sport, league) {
  let folder = SPORT_TO_FOLDER[sport] || 'other';
  
  if (sport === 'soccer' && league) {
    folder = SOCCER_LEAGUE_TO_FOLDER[league] || folder;
  }

  // Ruta base donde están los logos
  // Ajustar según donde estén los logos en el servidor
  const teamsBasePath = process.env.TEAMS_PATH || path.join(__dirname, '..', 'public', 'teams');
  const logoFolder = path.join(teamsBasePath, folder);

  if (!fs.existsSync(logoFolder)) {
    console.warn(`[ImageGenerator] Logo folder not found: ${logoFolder}`);
    return null;
  }

  // Buscar archivo del logo
  const teamNameLower = teamName.toLowerCase().trim();
  const normalizedName = normalizeTeamName(teamName);
  const files = fs.readdirSync(logoFolder);
  
  console.log(`[ImageGenerator] Searching for logo: "${teamName}" (normalized: "${normalizedName}") in folder: ${logoFolder}`);
  console.log(`[ImageGenerator] Available files: ${files.slice(0, 10).join(', ')}... (${files.length} total)`);
  
  // 1. Buscar en mapeo explícito primero
  if (TEAM_NAME_TO_FILENAME[teamNameLower]) {
    const mappedName = TEAM_NAME_TO_FILENAME[teamNameLower];
    for (const file of files) {
      const fileName = path.parse(file).name;
      if (fileName.toLowerCase() === mappedName.toLowerCase()) {
        console.log(`[ImageGenerator] ✅ Mapped match found: ${file}`);
        return path.join(logoFolder, file);
      }
    }
  }
  
  // 2. Buscar coincidencia exacta (nombre normalizado sin espacios)
  for (const file of files) {
    const fileName = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (fileName === normalizedName) {
      console.log(`[ImageGenerator] ✅ Exact match found: ${file}`);
      return path.join(logoFolder, file);
    }
  }
  
  // 3. Buscar coincidencia parcial (substring)
  for (const file of files) {
    const fileName = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Si el nombre normalizado contiene el nombre del archivo o viceversa
    if (fileName.includes(normalizedName) || normalizedName.includes(fileName)) {
      // Verificar que la coincidencia sea significativa (al menos 5 caracteres)
      const minLength = Math.min(fileName.length, normalizedName.length);
      if (minLength >= 5) {
        console.log(`[ImageGenerator] ✅ Substring match found: ${file} (${fileName} <-> ${normalizedName})`);
        return path.join(logoFolder, file);
      }
    }
  }
  
  // 4. Buscar por palabras clave (para nombres compuestos)
  const teamWords = teamNameLower.split(/\s+/).filter(w => w.length > 3 && !['city', 'the', 'and', 'of'].includes(w));
  if (teamWords.length > 0) {
    for (const file of files) {
      const fileName = path.parse(file).name.toLowerCase();
      // Verificar si al menos 2 palabras del equipo están en el nombre del archivo
      const matchingWords = teamWords.filter(word => fileName.includes(word));
      if (matchingWords.length >= Math.min(2, teamWords.length)) {
        console.log(`[ImageGenerator] ✅ Keyword match found: ${file} (matching words: ${matchingWords.join(', ')})`);
        return path.join(logoFolder, file);
      }
    }
  }
  
  console.warn(`[ImageGenerator] ❌ No match found for "${teamName}" (normalized: "${normalizedName}")`);

  // Fallback: logo genérico
  const genericPath = path.join(teamsBasePath, 'generico.png');
  if (fs.existsSync(genericPath)) {
    return genericPath;
  }

  return null;
}

/**
 * Carga un logo de equipo
 */
async function loadTeamLogo(teamName, sport, league) {
  try {
    const logoPath = findTeamLogo(teamName, sport, league);
    
    if (logoPath && fs.existsSync(logoPath)) {
      console.log(`[ImageGenerator] Loading logo: ${logoPath}`);
      return await loadImage(logoPath);
    }

    console.warn(`[ImageGenerator] No logo found for ${teamName} (${sport})`);
    return null;
  } catch (error) {
    console.error(`[ImageGenerator] Error loading logo for ${teamName}:`, error.message);
    return null;
  }
}

/**
 * Dibuja el fondo con gradiente rojo/azul de StreamBox
 */
function drawBackground(ctx, width, height) {
  // Gradiente diagonal de rojo a azul (colores StreamBox)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#E41E26'); // Rojo StreamBox
  gradient.addColorStop(0.5, '#8B1A1F'); // Rojo oscuro en el medio
  gradient.addColorStop(1, '#0052A5'); // Azul StreamBox
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Dibuja el título de la liga
 */
function drawLeagueTitle(ctx, league, width) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px Arial, Helvetica, sans-serif'; // Sin comillas
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const leagueText = (league || 'GAME').toUpperCase();
  console.log(`[ImageGenerator] Drawing league title: "${leagueText}" at (${width / 2}, 60)`);
  ctx.fillText(leagueText, width / 2, 60);
  ctx.restore();
}

/**
 * Dibuja un equipo completo (logo, nombre, marcador)
 */
async function drawTeam(ctx, team, x, y, isWinner, sport, league) {
  const logoSize = 200;
  const logoY = y;
  const nameY = logoY + logoSize + 25;
  const scoreY = nameY + 60;

  // Logo del equipo
  try {
    const logo = await loadTeamLogo(team.name, sport, league);
    if (logo) {
      const logoX = x - logoSize / 2;
      
      // Dibujar logo con sombra sutil
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      
      // Resetear sombra
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  } catch (error) {
    console.warn(`[ImageGenerator] Could not load logo for ${team.name}:`, error.message);
  }

  // Nombre del equipo - Asegurar que se dibuje
  ctx.save();
  
  // Configurar estilo de texto
  ctx.fillStyle = '#0052A5'; // Azul StreamBox
  ctx.font = 'bold 44px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Truncar nombre si es muy largo
  let teamName = team.name || 'Team';
  if (teamName.length > 18) {
    teamName = teamName.substring(0, 18) + '...';
  }
  
  // Dibujar nombre del equipo
  console.log(`[ImageGenerator] Drawing team name: "${teamName.toUpperCase()}" at (${x}, ${nameY})`);
  ctx.fillText(teamName.toUpperCase(), x, nameY);
  
  ctx.restore();

  // Marcador - Asegurar que se dibuje (en un save/restore separado)
  ctx.save();
  
  ctx.fillStyle = '#E41E26'; // Rojo StreamBox
  ctx.font = 'bold 96px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Dibujar marcador
  const scoreText = (team.score || 0).toString();
  console.log(`[ImageGenerator] Drawing score: "${scoreText}" at (${x}, ${scoreY})`);
  ctx.fillText(scoreText, x, scoreY);
  
  ctx.restore();
}

/**
 * Dibuja el texto "FINAL"
 */
function drawFinalText(ctx, width, height) {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial, Helvetica, sans-serif'; // Sin comillas
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const finalY = height - 120;
  console.log(`[ImageGenerator] Drawing FINAL text at (${width / 2}, ${finalY})`);
  ctx.fillText('FINAL', width / 2, finalY);
  ctx.restore();
}

/**
 * Genera una imagen de resultado de partido usando Canvas
 */
export async function generateMatchResultImage(gameData, options = {}) {
  console.log(`[ImageGenerator] 🎨 Starting image generation for: ${gameData.awayTeam?.name} vs ${gameData.homeTeam?.name}`);
  console.log(`[ImageGenerator] 📊 Scores: ${gameData.awayTeam?.score} - ${gameData.homeTeam?.score}`);
  console.log(`[ImageGenerator] 🏆 Sport: ${gameData.sport}, League: ${gameData.league}`);
  
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d');

  // 1. Fondo con gradiente
  console.log(`[ImageGenerator] 🎨 Step 1: Drawing background...`);
  drawBackground(ctx, opts.width, opts.height);

  // 2. Título de la liga
  const leagueName = gameData.league || gameData.sport.toUpperCase();
  console.log(`[ImageGenerator] 🎨 Step 2: Drawing league title: ${leagueName}`);
  drawLeagueTitle(ctx, leagueName, opts.width);

  // 3. Determinar ganador
  const winner = gameData.awayTeam.score > gameData.homeTeam.score 
    ? gameData.awayTeam 
    : gameData.homeTeam;

  // 4. Dibujar equipos
  const centerX = opts.width / 2;
  const teamY = 250;
  const awayX = centerX - 240;
  const homeX = centerX + 240;

  console.log(`[ImageGenerator] 🎨 Step 3: Drawing away team: ${gameData.awayTeam.name}`);
  await drawTeam(
    ctx,
    gameData.awayTeam,
    awayX,
    teamY,
    gameData.awayTeam.name === winner.name,
    gameData.sport,
    gameData.league
  );

  console.log(`[ImageGenerator] 🎨 Step 4: Drawing home team: ${gameData.homeTeam.name}`);
  await drawTeam(
    ctx,
    gameData.homeTeam,
    homeX,
    teamY,
    gameData.homeTeam.name === winner.name,
    gameData.sport,
    gameData.league
  );

  // 5. Línea divisoria entre equipos (VS)
  console.log(`[ImageGenerator] 🎨 Step 5: Drawing divider and VS text...`);
  ctx.strokeStyle = '#FFFFFF40';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, teamY - 10);
  ctx.lineTo(centerX, teamY + 420);
  ctx.stroke();
  
  // Texto "VS" en el centro
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Blanco con opacidad
  ctx.font = 'bold 32px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const vsY = teamY + 200;
  console.log(`[ImageGenerator] Drawing VS text at (${centerX}, ${vsY})`);
  ctx.fillText('VS', centerX, vsY);
  ctx.restore();

  // 6. Texto "FINAL"
  console.log(`[ImageGenerator] 🎨 Step 6: Drawing FINAL text...`);
  drawFinalText(ctx, opts.width, opts.height);

  // 7. Convertir a buffer PNG
  console.log(`[ImageGenerator] ✅ Image generation complete, converting to PNG...`);
  const buffer = canvas.toBuffer('image/png');
  console.log(`[ImageGenerator] ✅ PNG buffer created: ${buffer.length} bytes`);
  return buffer;
}



