// ============================================================
//  AUTENTICACIÓN
// ============================================================
// Maneja el login y la sesión del usuario.
// Como esto vive en el navegador, no es 100% seguro pero sirve
// como barrera para visitantes casuales.

import {
  LOGIN_USERNAME,
  LOGIN_PASSWORD,
  SESSION_DURATION_MS,
  SESSION_KEY,
} from '../config.js';

/**
 * Verifica si las credenciales son correctas.
 */
export function checkCredentials(username, password) {
  return username === LOGIN_USERNAME && password === LOGIN_PASSWORD;
}

/**
 * Guarda la sesión en el navegador (con fecha de expiración).
 */
export function saveSession() {
  const session = {
    user: LOGIN_USERNAME,
    expiresAt: SESSION_DURATION_MS > 0
      ? Date.now() + SESSION_DURATION_MS
      : null, // null = dura hasta cerrar navegador
  };
  try {
    if (SESSION_DURATION_MS > 0) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Error guardando sesión:', e);
  }
}

/**
 * Verifica si hay una sesión activa y no expirada.
 */
export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    // Si no tiene expiración (null), sigue válida mientras dure el navegador
    if (session.expiresAt === null) return true;
    // Si la fecha de expiración ya pasó, no está autenticado
    if (Date.now() > session.expiresAt) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Cierra la sesión.
 */
export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}
