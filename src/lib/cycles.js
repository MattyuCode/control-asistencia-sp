// ============================================================
//  CICLOS DE PAGO
// ============================================================
// Cada empleado tiene un ciclo de pago diferente:
// - Teresa: del 19 al 18 del mes siguiente (el 18 es día de pago)
// - Sebas: del 1 al último día del mes (mensual)

import { EMPLOYEES, PAY_HALF, PAY_FULL, PAY_PER_HOUR } from '../config.js';
import { STATUS_META } from './status.js';
import { parseKey } from './helpers.js';

/**
 * Devuelve el rango de fechas del ciclo de un empleado.
 *
 * @param {string} empKey - 'teresa' o 'sebas'
 * @param {number} offset - 0 = ciclo actual, -1 = anterior, +1 = siguiente
 * @returns {{ start: Date, end: Date, payDate: Date, mensual: boolean }}
 */
export function getCycle(empKey, offset = 0) {
  const emp = EMPLOYEES[empKey];
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  if (emp.cycleType === 'monthly') {
    // SEBAS: ciclo mensual (del 1 al último día del mes)
    const baseMonth = m + offset;
    return {
      start: new Date(y, baseMonth, 1),
      end: new Date(y, baseMonth + 1, 0),       // último día del mes
      payDate: new Date(y, baseMonth + 1, 0),
      mensual: true,
    };
  }

  // TERESA: ciclo del 19 al 18
  // Si hoy >= 19, el ciclo actual empezó este mes
  // Si hoy <= 18, el ciclo actual empezó el mes pasado (termina hoy o antes)
  let baseMonth, baseYear;
  if (d >= 19) {
    baseMonth = m;
    baseYear = y;
  } else {
    baseMonth = m - 1;
    baseYear = y;
  }
  baseMonth += offset;

  return {
    start: new Date(baseYear, baseMonth, 19),
    end: new Date(baseYear, baseMonth + 1, 18),
    payDate: new Date(baseYear, baseMonth + 1, 18),
    mensual: false,
  };
}

/**
 * Calcula el pago total del ciclo actual de un empleado.
 *
 * @param {object} empData - datos del empleado: { "2026-05-15": { status: "medio", ... } }
 * @param {string} empKey - 'teresa' o 'sebas'
 * @param {number} offset - desplazamiento del ciclo (0 = actual)
 */
export function calculateCyclePay(empData, empKey, offset = 0) {
  const cycle = getCycle(empKey, offset);
  let medios = 0, completos = 0, feriados = 0, feriadosTrab = 0, horasRepExtra = 0;

  Object.entries(empData || {}).forEach(([key, val]) => {
    const { y, m, d } = parseKey(key);
    const dt = new Date(y, m, d);
    if (dt >= cycle.start && dt <= cycle.end) {
      if (val.status === 'medio') medios++;
      else if (val.status === 'completo') completos++;
      else if (val.status === 'feriado') feriados++;
      else if (val.status === 'feriado_trabajado') feriadosTrab++;
      horasRepExtra += (val.repExtra || 0);
    }
  });

  const pagoHorasRep = horasRepExtra * PAY_PER_HOUR;
  const pagoFeriados = feriados * PAY_HALF + feriadosTrab * PAY_FULL;

  return {
    ...cycle,
    medios,
    completos,
    feriados,
    feriadosTrab,
    horasRepExtra,
    pagoHorasRep,
    pagoFeriados,
    total: medios + completos + feriados + feriadosTrab,
    amount: medios * PAY_HALF + completos * PAY_FULL + pagoHorasRep + pagoFeriados,
  };
}

/**
 * Calcula el saldo de reposición ACUMULADO HISTÓRICO de un empleado.
 * No se limita al ciclo, suma desde siempre.
 */
export function calculateReposicion(empData) {
  let horasPerdidas = 0;
  let horasRepuestas = 0;
  let faltas = 0;
  let completos = 0;
  let totalHorasExtra = 0;

  Object.entries(empData || {}).forEach(([key, val]) => {
    if (!val.status && !val.repExtra) return;
    const meta = val.status ? STATUS_META[val.status] : null;
    if (meta) {
      horasPerdidas += meta.lostHours || 0;
      horasRepuestas += meta.repHoursBase || 0;
      if (val.status === 'falta') faltas++;
      if (val.status === 'completo') completos++;
    }
    const extra = val.repExtra || 0;
    horasRepuestas += extra;
    if (extra > 0) totalHorasExtra += extra;
  });

  return {
    horasPerdidas,
    horasRepuestas,
    pendiente: Math.max(0, horasPerdidas - horasRepuestas),
    faltas,
    completos,
    totalHorasExtra,
  };
}
