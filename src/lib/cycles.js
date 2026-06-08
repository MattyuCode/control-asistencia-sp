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
 * Cuenta los días hábiles (lunes a viernes) entre dos fechas, inclusive.
 */
function countWorkingDays(start, end) {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay(); // 0=Dom, 6=Sáb
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/**
 * Devuelve el rango de fechas del ciclo de un empleado.
 *
 * @param {string} empKey - 'teresa' o 'sebas'
 * @param {number} offset - 0 = ciclo actual, -1 = anterior, +1 = siguiente
 * @returns {{ start: Date, end: Date, payDate: Date, mensual: boolean }}
 */
export function getCycle(empKey, offset = 0, refDate = null) {
  const emp = EMPLOYEES[empKey];
  const ref = refDate || new Date();
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const d = ref.getDate();

  // Ciclos biweekly genéricos:
  // biweekly_19 → Teresa: del 19 al 18, pago el 18
  // biweekly_7  → Sebas:  del 7 al 6,  pago el 6
  // biweekly_19 → Teresa: del 19 al 18, pago el 18
  // biweekly_7  → Sebas:  del 7 al 6,  pago el 6
  //   Todos los ciclos: 7 del mes M → 6 del mes M+1
  //   EXCEPCIÓN: el primer ciclo arrancó el 6 de mayo (firstCycleEnd = 6 jun 2026)
  //   Para ese ciclo especial, startDay = 6 en lugar de 7.

  if (emp.cycleType === 'biweekly_7') {
    // El ciclo TERMINA siempre el 6.
    // Si d > 6 → el ciclo activo cierra el próximo mes.
    // Si d ≤ 6 → el ciclo activo cierra este mes (estamos en los días de cierre/pago).
    const endMonth = (d > 6 ? m + 1 : m) + offset;
    const end      = new Date(y, endMonth, 6);
    const payDate  = end;

    // ¿Es el primer ciclo especial (mayo 6 → jun 6)?
    const firstEnd = emp.firstCycleEnd ? new Date(emp.firstCycleEnd) : null;
    const isFirstCycle = firstEnd &&
      end.getFullYear() === firstEnd.getFullYear() &&
      end.getMonth()    === firstEnd.getMonth();

    const startDay = isFirstCycle ? 6 : 7;
    const start    = new Date(end.getFullYear(), end.getMonth() - 1, startDay);

    return { start, end, payDate, mensual: false };
  }

  // Teresa: biweekly_19 — del 19 al 18
  const startDay = 19;
  let baseMonth = (d >= startDay ? m : m - 1) + offset;

  return {
    start:   new Date(y, baseMonth,     19),
    end:     new Date(y, baseMonth + 1, 18),
    payDate: new Date(y, baseMonth + 1, 18),
    mensual: false,
  };
}

/**
 * Calcula el pago total del ciclo de un empleado para el mes que se está viendo.
 *
 * Para Sebas (mensual con payDay):
 *   - Si el mes visto está dentro del período NO pagado aún, acumula desde
 *     el inicio de ese período hasta el fin del mes visto (o hoy si es el mes actual).
 *   - Si el mes visto ya fue pagado (pasado), muestra solo ese mes.
 *
 * Para Teresa (biweekly_19):
 *   - Muestra el ciclo 19→18 que contiene el día 15 del mes visto.
 *
 * @param {object} empData  - datos del empleado
 * @param {string} empKey   - 'teresa' o 'sebas'
 * @param {number} _offset  - ignorado (se mantiene por compatibilidad)
 * @param {Date|null} refDate - fecha de referencia (se usa el día 15 del mes visto)
 */
export function calculateCyclePay(empData, empKey, _offset = 0, refDate = null) {
  const emp = EMPLOYEES[empKey];
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth();
  const td = today.getDate();

  // Ambos empleados usan ciclos biweekly (19→18 ó 6→5)
  const mensual = false;
  const ref = refDate || today;
  const vy  = ref.getFullYear();
  const vm  = ref.getMonth();

  const activeCycle      = getCycle(empKey, 0);
  const activeStartM     = activeCycle.start.getMonth();
  const activeStartY     = activeCycle.start.getFullYear();
  const activeEndM       = activeCycle.end.getMonth();
  const activeEndY       = activeCycle.end.getFullYear();

  const viewMonthStart   = new Date(vy, vm, 1);
  const activeCycleStart = new Date(activeStartY, activeStartM, 1);
  const activeCycleEnd   = new Date(activeEndY,   activeEndM,   1);

  const isInActiveCycle  = viewMonthStart >= activeCycleStart
                        && viewMonthStart <= activeCycleEnd;

  let start, end, payDate;
  if (isInActiveCycle) {
    start   = activeCycle.start;
    end     = activeCycle.end;
    payDate = activeCycle.payDate;
  } else {
    const cycle = getCycle(empKey, 0, new Date(vy, vm, 15));
    start   = cycle.start;
    end     = cycle.end;
    payDate = cycle.payDate;
  }

  // Contar días trabajados en el rango calculado
  let medios = 0, completos = 0, feriados = 0, feriadosTrab = 0, horasRepExtra = 0;

  Object.entries(empData || {}).forEach(([key, val]) => {
    const { y, m, d } = parseKey(key);
    const dt = new Date(y, m, d);
    if (dt >= start && dt <= end) {
      if (val.status === 'medio') medios++;
      else if (val.status === 'completo') completos++;
      else if (val.status === 'feriado') feriados++;
      else if (val.status === 'feriado_trabajado') feriadosTrab++;
      horasRepExtra += (val.repExtra || 0);
    }
  });

  const totalDias = medios + completos + feriados + feriadosTrab;

  let amount;
  let pagoHorasRep;
  let dailyRate = null;
  let workingDaysInCycle = null;
  let pagoFeriados;

  if (emp.monthlySalary && !mensual) {
    // TERESA: tasa proporcional — Q700 ÷ días hábiles del ciclo
    // - medio día    = 1 × dailyRate
    // - día completo = 2 × dailyRate (trabaja el doble de su horario normal)
    // - feriado      = 1 × dailyRate (se le paga aunque no trabaje)
    // - feriado trab = 2 × dailyRate (trabaja en día que normalmente no iría)
    // - hora reposi  = dailyRate ÷ 6  (6h = 1 medio día)
    workingDaysInCycle = countWorkingDays(start, end);
    dailyRate = workingDaysInCycle > 0 ? emp.monthlySalary / workingDaysInCycle : 0;
    const hourlyRate = dailyRate / 6;
    pagoHorasRep = horasRepExtra * hourlyRate;
    pagoFeriados = (feriados + feriadosTrab) * dailyRate;
    amount = (medios * dailyRate)
           + (completos * dailyRate * 2)
           + pagoFeriados
           + pagoHorasRep;
  } else {
    // SEBAS: pago por día trabajado sin tope
    pagoFeriados = feriados * PAY_HALF + feriadosTrab * PAY_FULL;
    pagoHorasRep = horasRepExtra * PAY_PER_HOUR;
    amount = medios * PAY_HALF + completos * PAY_FULL + pagoFeriados + pagoHorasRep;
  }

  return {
    start, end, payDate, mensual,
    medios, completos, feriados, feriadosTrab,
    horasRepExtra, pagoHorasRep, pagoFeriados,
    total: totalDias,
    amount,
    dailyRate,
    workingDaysInCycle,
    monthlySalary: emp.monthlySalary || null,
    capped: false,
  };
}

/**
 * Devuelve los datos del ciclo ANTERIOR al que se está viendo.
 * Solo aplica para Teresa (biweekly_19).
 * Útil para mostrar el historial del último pago realizado.
 */
export function calculatePrevCyclePay(empData, empKey, refDate = null) {
  const emp = EMPLOYEES[empKey];
  if (!emp.cycleType.startsWith('biweekly')) return null;

  const ref      = refDate || new Date();
  const prevCycle = getCycle(empKey, -1, ref);
  const { start: prevStart, end: prevEnd, payDate: prevPay } = prevCycle;

  let medios = 0, completos = 0, feriados = 0, feriadosTrab = 0, horasRepExtra = 0;

  Object.entries(empData || {}).forEach(([key, val]) => {
    const { y, m, d } = parseKey(key);
    const dt = new Date(y, m, d);
    if (dt >= prevStart && dt <= prevEnd) {
      if (val.status === 'medio') medios++;
      else if (val.status === 'completo') completos++;
      else if (val.status === 'feriado') feriados++;
      else if (val.status === 'feriado_trabajado') feriadosTrab++;
      horasRepExtra += (val.repExtra || 0);
    }
  });

  const totalDias = medios + completos + feriados + feriadosTrab;
  const workingDays = countWorkingDays(prevStart, prevEnd);
  const dailyRate   = workingDays > 0 ? emp.monthlySalary / workingDays : 0;
  const hourlyRate  = dailyRate / 6;
  const pagoHorasRep = horasRepExtra * hourlyRate;
  const amount = (medios * dailyRate) + (completos * dailyRate * 2) + pagoHorasRep;

  return {
    start: prevStart, end: prevEnd, payDate: prevPay,
    medios, completos, feriados, feriadosTrab,
    horasRepExtra, pagoHorasRep, total: totalDias, amount,
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
