// ============================================================
//  DAY CELL
// ============================================================
// Una celda individual del calendario. Muestra el número del día,
// el estado (si lo hay) y el badge de horas de reposición.

import { STATUS_META } from '../lib/status.js';

export default function DayCell({ day, entry, weekend, weekendActive, blocked, inCycle, isToday, onClick }) {
  // Construir las clases base según el estado
  let bg = 'bg-paper-warm';
  let cursor = 'cursor-pointer';
  let extra = 'transition-colors hover:bg-paper';

  if (blocked) {
    bg = 'bg-ink/5';
    cursor = 'cursor-default pointer-events-none';
    extra = '';
  } else if (weekendActive) {
    // Día de fin de semana habilitado (Sebas) - color tenue dorado
    bg = 'bg-gold/5 hover:bg-gold/15';
    extra = 'transition-colors weekend-corner';
  } else if (inCycle) {
    bg = 'bg-accent/[0.06] hover:bg-paper';
  }

  // Día de hoy: borde dorado por dentro
  const todayClass = isToday ? 'ring-2 ring-inset ring-gold bg-gold/15' : '';

  // Número del día: gris/cursiva si es fin de semana bloqueado
  const numClass = blocked
    ? 'text-muted italic'
    : 'text-ink';

  return (
    <div
      onClick={onClick}
      className={`
        aspect-[1/1.05] border-r border-b border-ink/15 last:border-r-0
        p-2 sm:p-2.5 relative flex flex-col
        ${bg} ${cursor} ${extra} ${todayClass}
      `}
    >
      {/* Número del día */}
      <div className={`font-serif font-semibold text-lg sm:text-xl leading-none ${numClass}`}>
        {day}
      </div>

      {/* Marca de nota (puntito naranja arriba a la derecha) */}
      {entry && entry.note && !entry.repExtra && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full"></div>
      )}

      {/* Badge de horas de reposición (verde con número) */}
      {entry && entry.repExtra > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-st-medio-extra text-paper font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          +{entry.repExtra}h
        </div>
      )}

      {/* Badge del estado abajo (medio día, completo, etc.) */}
      {entry && entry.status && STATUS_META[entry.status] && (
        <div className={`
          mt-auto font-mono text-[8px] sm:text-[8.5px] tracking-wider uppercase
          py-1 px-1.5 text-center font-bold leading-tight rounded-sm
          ${STATUS_META[entry.status].bgColor}
          ${STATUS_META[entry.status].textColor}
        `}>
          {STATUS_META[entry.status].short}
        </div>
      )}
    </div>
  );
}
