// ============================================================
//  PAY PANEL
// ============================================================
// Muestra el pago del ciclo actual del empleado: total y desglose.

import { calculateCyclePay } from '../lib/cycles.js';
import { EMPLOYEES, PAY_HALF, PAY_FULL } from '../config.js';
import { fmtDate } from '../lib/helpers.js';

export default function PayPanel({ empKey, empData }) {
  const c = calculateCyclePay(empData, empKey, 0);
  const empName = EMPLOYEES[empKey].name;

  // Texto de etiqueta del pago (varía según el tipo de ciclo)
  let payLabel;
  if (c.mensual) {
    payLabel = 'pago al cierre del mes';
  } else {
    payLabel = `próximo pago ${fmtDate(c.payDate)}`;
  }

  // Texto de feriados (combinado si hay normales y trabajados)
  let feriadoTxt = '0';
  if (c.feriados > 0 && c.feriadosTrab > 0) {
    feriadoTxt = `${c.feriados}×Q${PAY_HALF} + ${c.feriadosTrab}×Q${PAY_FULL} = Q${c.pagoFeriados.toFixed(2)}`;
  } else if (c.feriados > 0) {
    feriadoTxt = `${c.feriados} × Q${PAY_HALF} = Q${c.feriados * PAY_HALF}`;
  } else if (c.feriadosTrab > 0) {
    feriadoTxt = `${c.feriadosTrab} × Q${PAY_FULL} = Q${c.feriadosTrab * PAY_FULL}`;
  }

  return (
    <div className="relative bg-ink text-paper p-6 border-2 border-ink shadow-brutal-accent">
      {/* Etiqueta del panel */}
      <span className="absolute -top-2.5 left-4 bg-ink px-2 font-mono text-[10px] tracking-wider uppercase text-paper-warm">
        Pago del ciclo
      </span>

      {/* Rango del ciclo */}
      <div className="font-mono text-[10px] tracking-wider uppercase text-gold mb-2">
        {fmtDate(c.start)} → {fmtDate(c.end)}
      </div>

      {/* Monto principal grande */}
      <div className="font-serif font-bold text-5xl leading-none tracking-tight">
        <span className="text-2xl font-normal text-gold mr-1.5">Q</span>
        {c.amount.toFixed(2)}
      </div>

      {/* Nombre y próximo pago */}
      <div className="font-mono text-[11px] tracking-wider text-paper/70 mt-1">
        {empName} · {payLabel}
      </div>

      {/* Desglose */}
      <div className="mt-4 pt-4 border-t border-paper/15">
        <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 font-mono text-[11px]">
          <span className="text-paper/75">Medios días</span>
          <span className="font-bold text-paper text-right">
            {c.medios} × Q{PAY_HALF} = Q{c.medios * PAY_HALF}
          </span>

          <span className="text-paper/75">Días completos</span>
          <span className="font-bold text-paper text-right">
            {c.completos} × Q{PAY_FULL} = Q{c.completos * PAY_FULL}
          </span>

          <span className="text-paper/75">Feriados</span>
          <span className="font-bold text-paper text-right">{feriadoTxt}</span>

          <span className="text-paper/75">Horas reposición</span>
          <span className="font-bold text-paper text-right">
            {c.horasRepExtra}h × Q5.83 = Q{c.pagoHorasRep.toFixed(2)}
          </span>

          <span className="text-paper/75">Total días</span>
          <span className="font-bold text-paper text-right">{c.total} días</span>
        </div>
      </div>
    </div>
  );
}
