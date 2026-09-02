/**
 * Pruebas de normalizeTeamName (src/image-generator.js): la clave con la que
 * se busca el archivo del escudo. Si esto cambia de forma, los logos dejan
 * de encontrarse aunque los archivos sigan ahí.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTeamName } from '../src/team-name.js'

test('minúsculas y sin espacios', () => {
  assert.equal(normalizeTeamName('Kansas City Chiefs'), 'kansascitychiefs')
})

test('quita formas jurídicas pero conserva palabras identificativas', () => {
  assert.equal(normalizeTeamName('Chelsea FC'), 'chelsea')
  assert.equal(normalizeTeamName('Real Madrid'), 'madrid')
  // "city" NO se elimina (el comentario del fuente lo exige)
  assert.equal(normalizeTeamName('Manchester City'), 'manchestercity')
})

test('quita símbolos', () => {
  assert.equal(normalizeTeamName('Blue-Jays!'), 'bluejays')
})

test('solo elimina la palabra exacta, no subcadenas', () => {
  // "United" se quita como palabra; "Uniteds" (hipotético) no se quitaría
  assert.equal(normalizeTeamName('Manchester United'), 'manchester')
  assert.equal(normalizeTeamName('Interbrew'), 'interbrew')
})

test('comportamiento actual con acentos: se pierden, no se transliteran', () => {
  // Documenta el comportamiento vigente: 'América' → 'amrica' (la á se borra).
  // Si algún día se translitera a 'america', esta prueba debe actualizarse
  // JUNTO con el renombrado de los archivos de logos que dependan de la clave.
  assert.equal(normalizeTeamName('América'), 'amrica')
})
