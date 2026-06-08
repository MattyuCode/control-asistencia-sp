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

  if (emp.cycleType === 'monthly') {
    // SEBAS: ciclo mensual (del 1 al último día del mes)
    // Si hoy es antes del día de pago, el ciclo "actual" es el mes anterior
    // (el trabajo ya se hizo pero aún no se cobró)
    const payDay = emp.payDay || 1;
    const baseMonth = d < payDay ? m - 1 + offset : m + offset;
    return {
      start: new Date(y, baseMonth, 1),
      end: new Date(y, baseMonth + 1, 0),       // último día del mes
      payDate: new Date(y, baseMonth + 1, payDay),
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

  let start, end, payDate, mensual;

  if (emp.cycleType === 'monthly') {
    mensual = true;
    const payDay = emp.payDay || 1;

    const ref = refDate || today;
    const vy = ref.getFullYear();
    const vm = ref.getMonth();

    // Inicio del período sin pagar
    let unpaidStartM = td < payDay ? tm - 1 : tm;
    let unpaidStartY = ty;
    if (unpaidStartM < 0) { unpaidStartM = 11; unpaidStartY--; }

    const unpaidStart = new Date(unpaidStartY, unpaidStartM, 1);
    const viewStart   = new Date(vy, vm, 1);
    const viewEnd     = new Date(vy, vm + 1, 0);
    const todayStart  = new Date(ty, tm, 1);

    const isUnpaidPeriod = viewStart >= unpaidStart && viewStart <= todayStart;

    if (isUnpaidPeriod) {
      // Período sin pagar: usar el fin del mes completo (no cortar en hoy)
      // Los días sin entrada simplemente no suman nada
      start   = unpaidStart;
      end     = viewEnd;
      payDate = new Date(unpaidStartY, unpaidStartM + 1, payDay);
    } else {
      start   = viewStart;
      end     = viewEnd;
      payDate = new Date(vy, vm + 1, payDay);
    }

  } else {
    // TERESA: ciclo 19 → 18
    mensual = false;
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

    if (isInActiveCycle) {
      // Ciclo activo: usar el fin real del ciclo (Jun 18)
      // Los días sin entrada no suman — no hace falta cortar en hoy
      start   = activeCycle.start;
      end     = activeCycle.end;
      payDate = activeCycle.payDate;
    } else {
      const cycle = getCycle(empKey, 0, new Date(vy, vm, 15));
      start   = cycle.start;
      end     = cycle.end;
      payDate = cycle.payDate;
    }
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
  if (emp.cycleType !== 'biweekly_19') return null;

  const ref   = refDate || new Date();
  // El ciclo actual se basa en el día 15 del mes visto
  const curStart = getCycle(empKey, 0, new Date(ref.getFullYear(), ref.getMonth(), 15)).start;

  // El ciclo anterior termina el día antes de que empiece el actual
  const prevStart = new Date(curStart.getFullYear(), curStart.getMonth() - 1, 19);
  const prevEnd   = new Date(curStart.getFullYear(), curStart.getMonth(),     18);
  const prevPay   = new Date(curStart.getFullYear(), curStart.getMonth(),     18);

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

  const pagoHorasRep = horasRepExtra * PAY_PER_HOUR;
  const totalDias = medios + completos + feriados + feriadosTrab;

  let amount;
  if (emp.monthlySalary) {
    const workingDays = countWorkingDays(prevStart, prevEnd);
    const dailyRate   = workingDays > 0 ? emp.monthlySalary / workingDays : 0;
    amount = totalDias * dailyRate + pagoHorasRep;
  } else {
    amount = medios * PAY_HALF + completos * PAY_FULL + pagoHorasRep;
  }

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
