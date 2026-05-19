// ============================================================
//  STORAGE: lectura y escritura en la nube (JSONBin)
// ============================================================
// Maneja toda la comunicación con la API de JSONBin.
// Tiene un caché local para que la app abra rápido incluso sin internet.

import {
  JSONBIN_BASE,
  JSONBIN_ACCESS_KEY,
  STORAGE_CACHE_KEY,
  EMPLOYEE_KEYS,
} from '../config.js';

/**
 * Devuelve un objeto vacío con la estructura correcta para los empleados.
 * Ejemplo: { teresa: {}, sebas: {} }
 */
function emptyData() {
  const obj = {};
  EMPLOYEE_KEYS.forEach(k => { obj[k] = {}; });
  return obj;
}

/**
 * Asegura que el objeto tenga la estructura correcta.
 * Si falta algún empleado, lo agrega vacío.
 */
function normalize(data) {
  const out = data || {};
  EMPLOYEE_KEYS.forEach(k => {
    if (!out[k]) out[k] = {};
  });
  return out;
}

/**
 * Lee el caché local del navegador.
 * Sirve para tener algo que mostrar al abrir, mientras se carga la nube.
 */
export function loadLocalCache() {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) {
    console.error('Error leyendo caché local:', e);
  }
  return emptyData();
}

/**
 * Guarda los datos en el caché local.
 */
export function saveLocalCache(data) {
  try {
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando caché local:', e);
  }
}

/**
 * Lee los datos de JSONBin (versión más reciente).
 * @returns {Promise<object|null>} - los datos o null si falla
 */
export async function loadFromCloud() {
  try {
    const response = await fetch(`${JSONBIN_BASE}/latest`, {
      method: 'GET',
      headers: {
        'X-Access-Key': JSONBIN_ACCESS_KEY,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const result = await response.json();
    return normalize(result.record);
  } catch (e) {
    console.error('Error al cargar desde JSONBin:', e);
    return null;
  }
}

/**
 * Guarda los datos en JSONBin.
 * @returns {Promise<boolean>} - true si tuvo éxito
 */
export async function saveToCloud(data) {
  try {
    const response = await fetch(JSONBIN_BASE, {
      method: 'PUT',
      headers: {
        'X-Access-Key': JSONBIN_ACCESS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return true;
  } catch (e) {
    console.error('Error al guardar en JSONBin:', e);
    return false;
  }
}
