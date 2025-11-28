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

/**
 * Normaliza el nombre del equipo para buscar el logo
 */
function normalizeTeamName(teamName) {
  return teamName
    .toLowerCase()
    .replace(/\b(fc|cf|sc|deportivo|club|team|united|city|athletic|real|inter|ac|borussia)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
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
  const normalizedName = normalizeTeamName(teamName);
  const files = fs.readdirSync(logoFolder);
  
  // Buscar por nombre normalizado
  for (const file of files) {
    const fileName = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (fileName === normalizedName || fileName.includes(normalizedName) || normalizedName.includes(fileName)) {
      return path.join(logoFolder, file);
    }
  }

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
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px "Arial", "Helvetica", sans-serif'; // Usar fuentes del sistema
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const leagueText = (league || 'GAME').toUpperCase();
  ctx.fillText(leagueText, width / 2, 60);
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
  ctx.fillStyle = '#0052A5'; // Azul StreamBox
  ctx.font = 'bold 44px "Arial", "Helvetica", sans-serif'; // Usar fuentes del sistema
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Truncar nombre si es muy largo
  let teamName = team.name || 'Team';
  if (teamName.length > 18) {
    teamName = teamName.substring(0, 18) + '...';
  }
  
  // Sombra sutil en el texto
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  // Dibujar nombre del equipo
  ctx.fillText(teamName.toUpperCase(), x, nameY);
  
  // Resetear sombra
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Marcador - Asegurar que se dibuje
  ctx.fillStyle = '#E41E26'; // Rojo StreamBox
  ctx.font = 'bold 96px "Arial", "Helvetica", sans-serif'; // Usar fuentes del sistema
  
  // Sombra más pronunciada en el marcador
  ctx.shadowColor = 'rgba(228, 30, 38, 0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  // Dibujar marcador
  const scoreText = (team.score || 0).toString();
  ctx.fillText(scoreText, x, scoreY);
  
  // Resetear sombra
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Dibuja el texto "FINAL"
 */
function drawFinalText(ctx, width, height) {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px "Arial", "Helvetica", sans-serif'; // Usar fuentes del sistema
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Asegurar que el texto se dibuje
  ctx.fillText('FINAL', width / 2, height - 120);
}

/**
 * Genera una imagen de resultado de partido usando Canvas
 */
export async function generateMatchResultImage(gameData, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d');

  // 1. Fondo con gradiente
  drawBackground(ctx, opts.width, opts.height);

  // 2. Título de la liga
  const leagueName = gameData.league || gameData.sport.toUpperCase();
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

  await drawTeam(
    ctx,
    gameData.awayTeam,
    awayX,
    teamY,
    gameData.awayTeam.name === winner.name,
    gameData.sport,
    gameData.league
  );

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
  ctx.strokeStyle = '#FFFFFF40';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, teamY - 10);
  ctx.lineTo(centerX, teamY + 420);
  ctx.stroke();
  
  // Texto "VS" en el centro
  ctx.fillStyle = '#FFFFFF80';
  ctx.font = 'bold 32px "Arial", "Helvetica", sans-serif'; // Usar fuentes del sistema
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', centerX, teamY + 200);

  // 6. Texto "FINAL"
  drawFinalText(ctx, opts.width, opts.height);

  // 7. Convertir a buffer PNG
  return canvas.toBuffer('image/png');
}



