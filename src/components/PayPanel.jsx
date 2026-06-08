// ============================================================
//  PAY PANEL
// ============================================================
import { calculateCyclePay, calculatePrevCyclePay } from '../lib/cycles.js';
import { EMPLOYEES, PAY_HALF, PAY_FULL } from '../config.js';
import { fmtDate } from '../lib/helpers.js';

export default function PayPanel({ empKey, empData, previewEntry, editingKey, viewYear, viewMonth }) {
  const refDate = viewYear != null && viewMonth != null
    ? new Date(viewYear, viewMonth, 15)
    : null;

  // Incluir el día en edición (futuro o no) en los datos para el cálculo
  let dataToUse = empData;
  if (previewEntry && editingKey) {
    dataToUse = { ...empData, [editingKey]: previewEntry };
  }

  const c    = calculateCyclePay(dataToUse, empKey, 0, refDate);
  const prev = calculatePrevCyclePay(dataToUse, empKey, refDate);
  const emp  = EMPLOYEES[empKey];

  return (
    <div className="flex flex-col gap-3">

      {/* ── CICLO ACTUAL ── */}
      <div className="relative bg-ink text-paper p-6 border-2 border-ink shadow-brutal-accent">
        <span className="absolute -top-2.5 left-4 bg-ink px-2 font-mono text-[10px] tracking-wider uppercase text-paper-warm">
          Pago del ciclo
        </span>

        {/* Rango con indicador de estado */}
        <div className="flex items-center gap-2 mb-2">
          <div className="font-mono text-[10px] tracking-wider uppercase text-gold">
            {fmtDate(c.start)} → {fmtDate(c.end)}
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 bg-paper/10 text-gold rounded">
            EN PROGRESO
          </span>
          {previewEntry && (
            <span className="font-mono text-[9px] px-2 py-0.5 bg-accent/20 text-accent rounded animate-pulse">
              VISTA PREVIA
            </span>
          )}
        </div>

        {/* Monto principal */}
        <div className={`font-serif font-bold text-5xl leading-none tracking-tight transition-colors ${previewEntry ? 'text-accent' : ''}`}>
          <span className="text-2xl font-normal text-gold mr-1.5">Q</span>
          {c.amount.toFixed(2)}
        </div>

        {/* Tope alcanzado */}
        {c.capped && (
          <div className="font-mono text-[10px] text-gold mt-1">
            ★ Salario máximo del ciclo alcanzado (Q{c.monthlySalary})
          </div>
        )}

        {/* Subtítulo con info de cierre */}
        <div className="font-mono text-[11px] tracking-wider text-paper/70 mt-1">
          {emp.name} · cierra {fmtDate(c.payDate)} · próximo pago {fmtDate(c.payDate)}
        </div>

        {/* Desglose */}
        <div className="mt-4 pt-4 border-t border-paper/15">
          <div className="mb-3 text-[10px] text-paper/60 italic">
            Acumulado desde {fmtDate(c.start)} hasta el período visible
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 font-mono text-[11px]">

            <span className="text-paper/75">Medios días</span>
            <span className="font-bold text-paper text-right">
              {c.dailyRate
                ? `${c.medios} × Q${c.dailyRate.toFixed(2)} = Q${(c.medios * c.dailyRate).toFixed(2)}`
                : `${c.medios} × Q${PAY_HALF} = Q${c.medios * PAY_HALF}`}
            </span>

            <span className="text-paper/75">Días completos</span>
            <span className="font-bold text-paper text-right">
              {c.dailyRate
                ? `${c.completos} × Q${(c.dailyRate * 2).toFixed(2)} = Q${(c.completos * c.dailyRate * 2).toFixed(2)}`
                : `${c.completos} × Q${PAY_FULL} = Q${c.completos * PAY_FULL}`}
            </span>

            <span className="text-paper/75">Feriados</span>
            <span className="font-bold text-paper text-right">
              {c.feriados + c.feriadosTrab > 0
                ? `${c.feriados + c.feriadosTrab} día(s)`
                : '0'}
            </span>

            <span className="text-paper/75">Horas reposición</span>
            <span className="font-bold text-paper text-right">
              {c.dailyRate
                ? `${c.horasRepExtra}h × Q${(c.dailyRate / 6).toFixed(2)} = Q${c.pagoHorasRep.toFixed(2)}`
                : `${c.horasRepExtra}h × Q5.83 = Q${c.pagoHorasRep.toFixed(2)}`}
            </span>

            {emp.monthlySalary && c.workingDaysInCycle && (
              <>
                <span className="text-paper/75">Días hábiles ciclo</span>
                <span className="font-bold text-paper text-right">{c.workingDaysInCycle} días → Q{c.monthlySalary}</span>
              </>
            )}

            <span className="text-paper/75 border-t border-paper/15 pt-1.5">Total días</span>
            <span className="font-bold text-paper text-right border-t border-paper/15 pt-1.5">
              {c.total} días
            </span>
          </div>
        </div>
      </div>

      {/* ── CICLO ANTERIOR (solo Teresa) ── */}
      {prev && (
        <div className="relative bg-ink/60 text-paper/80 px-5 py-4 border border-paper/20">
          <span className="absolute -top-2.5 left-4 bg-[#1a1a2e] px-2 font-mono text-[10px] tracking-wider uppercase text-paper/50">
            Ciclo anterior pagado
          </span>

          <div className="font-mono text-[10px] tracking-wider uppercase text-gold/70 mb-1">
            {fmtDate(prev.start)} → {fmtDate(prev.end)}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-2xl text-paper/80">
              Q{prev.amount.toFixed(2)}
            </span>
            <span className="font-mono text-[10px] text-paper/50">
              {prev.total} días · pagado {fmtDate(prev.payDate)}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
