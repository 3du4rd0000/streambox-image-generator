/**
 * Normalización del nombre de equipo — la clave con la que se busca el
 * archivo del escudo en public/teams/.
 *
 * Vive en su propio módulo (sin dependencias) para poder probarse sin cargar
 * `canvas`, que es un binario nativo y no siempre está disponible.
 *
 * NO elimina palabras importantes como "city", "chiefs", etc.
 */
export function normalizeTeamName(teamName) {
  return teamName
    .toLowerCase()
    .replace(/\b(fc|cf|sc|deportivo|club|team|united|athletic|real|inter|ac|borussia)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
}
