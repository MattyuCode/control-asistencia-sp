// ============================================================
//  CALENDAR
// ============================================================
// Cuadrícula del mes con todos los días.
// Usa el componente DayCell para cada día individual.

import { useMemo } from 'react';
import DayCell from './DayCell.jsx';
import { dateKey, isWeekend } from '../lib/helpers.js';
import { getCycle } from '../lib/cycles.js';
import { EMPLOYEES } from '../config.js';

export default function Calendar({ year, month, empKey, empData, onDayClick }) {
  // useMemo() guarda en caché el cálculo y solo lo rehace si cambian las dependencias.
  // Útil para evitar recalcular cosas pesadas en cada re-render.
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Determinar en qué columna empieza el día 1 (Lunes=0 ... Domingo=6)
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const result = [];

    // Celdas vacías al inicio (para alinear con el día de la semana)
    for (let i = 0; i < startDow; i++) {
      result.push({ empty: true, key: 'empty-' + i });
    }

    // Días del mes
    for (let d = 1; d <= lastDay.getDate(); d++) {
      result.push({ day: d, key: dateKey(year, month, d) });
    }

    return result;
  }, [year, month]);

  // Información del ciclo y de hoy
  const cycle = getCycle(empKey, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const worksWeekends = EMPLOYEES[empKey].worksWeekends;

  return (
    <div className="bg-paper-warm border-2 border-ink shadow-brutal-lg">
      {/* Encabezado con los días de la semana */}
      <div className="grid grid-cols-7 border-b-2 border-ink bg-ink text-paper">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(d => (
          <div key={d} className="py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase border-r border-paper/15">
            {d}
          </div>
        ))}
        {['Sáb', 'Dom'].map(d => (
          <div key={d} className="py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase border-r border-paper/15 last:border-r-0 text-gold">
            {d}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7">
        {cells.map(cell => {
          if (cell.empty) {
            return <div key={cell.key} className="aspect-[1/1.05]" />;
          }

          const dt = new Date(year, month, cell.day);
          const weekend = isWeekend(year, month, cell.day);
          const blocked = weekend && !worksWeekends;
          const inCycle = dt >= cycle.start && dt <= cycle.end;
          const isToday = dt.getTime() === today.getTime();
          const entry = empData[cell.key];

          return (
            <DayCell
              key={cell.key}
              day={cell.day}
              entry={entry}
              weekend={weekend}
              weekendActive={weekend && worksWeekends}
              blocked={blocked}
              inCycle={inCycle}
              isToday={isToday}
              onClick={() => !blocked && onDayClick(year, month, cell.day)}
            />
          );
        })}
      </div>
    </div>
  );
}
