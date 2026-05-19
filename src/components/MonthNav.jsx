// ============================================================
//  MONTH NAV
// ============================================================
// Botones para navegar entre meses y los botones de acciones (sincronizar, limpiar).

import { MONTH_NAMES } from '../lib/helpers.js';

export default function MonthNav({ viewYear, viewMonth, onPrev, onNext, onToday, onRefresh, onClearMonth }) {
  const baseBtn = "font-mono text-[10px] tracking-wider uppercase font-medium px-3.5 py-2.5 border-[1.5px] border-ink cursor-pointer transition-colors duration-200";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Lado izquierdo: navegación de mes */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onPrev}
          className="w-10 h-10 border-[1.5px] border-ink bg-transparent cursor-pointer font-serif text-xl flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
        >
          ‹
        </button>

        <div className="font-serif text-xl sm:text-2xl font-semibold min-w-[200px] sm:min-w-[260px] text-center">
          {MONTH_NAMES[viewMonth]}{' '}
          <span className="italic font-normal text-accent ml-1">{viewYear}</span>
        </div>

        <button
          onClick={onNext}
          className="w-10 h-10 border-[1.5px] border-ink bg-transparent cursor-pointer font-serif text-xl flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
        >
          ›
        </button>

        <button
          onClick={onToday}
          className={`${baseBtn} bg-paper-warm hover:bg-ink hover:text-paper`}
        >
          Hoy
        </button>
      </div>

      {/* Lado derecho: acciones */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRefresh}
          className={`${baseBtn} bg-accent text-paper border-accent hover:bg-accent-deep`}
        >
          ↻ Sincronizar
        </button>
        <button
          onClick={onClearMonth}
          className={`${baseBtn} bg-paper hover:bg-ink hover:text-paper`}
        >
          Limpiar mes
        </button>
      </div>
    </div>
  );
}
