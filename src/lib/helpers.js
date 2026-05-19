// ============================================================
//  HELPERS: funciones de fechas y formato
// ============================================================
// Funciones pequeñas que se usan en varios lugares del código.

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MONTH_NAMES_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const WEEKDAY_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

/**
 * Crea una "key" de fecha en formato YYYY-MM-DD para usar como ID único.
 * Ejemplo: dateKey(2026, 4, 18) → "2026-05-18"
 */
export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Parsea una key de fecha de vuelta a sus componentes.
 * Ejemplo: parseKey("2026-05-18") → { y: 2026, m: 4, d: 18 }
 * (mes en formato 0-11 como en JavaScript)
 */
export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m: m - 1, d };
}

/**
 * ¿Es sábado o domingo?
 */
export function isWeekend(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 || dow === 6;
}

/**
 * Formato corto de fecha: "18 may"
 */
export function fmtDate(date) {
  return `${date.getDate()} ${MONTH_NAMES_SHORT[date.getMonth()].toLowerCase()}`;
}

/**
 * Formato completo: "18 de mayo 2026"
 */
export function fmtDateFull(date) {
  return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()].toLowerCase()} ${date.getFullYear()}`;
}
