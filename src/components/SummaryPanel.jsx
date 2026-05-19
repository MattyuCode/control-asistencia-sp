// ============================================================
//  SUMMARY PANEL
// ============================================================
// Resumen del mes visible: cuenta de cada estado.

import { parseKey } from '../lib/helpers.js';

export default function SummaryPanel({ empData, year, month }) {
  // Contadores
  const counts = {
    medio: 0, completo: 0, falta: 0, vacaciones: 0,
    permiso: 0, enfermedad: 0, feriado: 0, feriado_trabajado: 0
  };
  let horasRep = 0;

  // Sumar todos los registros del mes visible
  Object.entries(empData).forEach(([key, val]) => {
    const { y, m } = parseKey(key);
    if (y === year && m === month) {
      if (val.status) counts[val.status] = (counts[val.status] || 0) + 1;
      horasRep += val.repExtra || 0;
    }
  });

  // Definir las celdas a mostrar
  const cells = [
    { num: counts.medio, lbl: 'Medio día' },
    { num: counts.completo, lbl: 'Completos' },
    { num: counts.falta, lbl: 'Faltas' },
    { num: `${horasRep}h`, lbl: 'H. reposición' },
    { num: counts.vacaciones, lbl: 'Vacaciones' },
    { num: counts.permiso, lbl: 'Permisos' },
    { num: counts.enfermedad, lbl: 'Enfermedad' },
    { num: counts.feriado + counts.feriado_trabajado, lbl: 'Feriados' },
  ];

  return (
    <div className="relative bg-paper-warm border-2 border-ink p-6">
      <span className="absolute -top-2.5 left-4 bg-paper px-2 font-mono text-[10px] tracking-wider uppercase text-ink-soft">
        Resumen del mes visible
      </span>

      <div className="grid grid-cols-2 gap-px bg-ink border border-ink mt-2">
        {cells.map((cell, i) => (
          <div key={i} className="bg-paper-warm p-3">
            <div className="font-serif font-bold text-2xl leading-none text-ink">
              {cell.num}
            </div>
            <div className="font-mono text-[8.5px] tracking-wider uppercase text-ink-soft mt-1.5">
              {cell.lbl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
