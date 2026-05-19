// ============================================================
//  LEGEND
// ============================================================
// Muestra qué significa cada color en el calendario.

import { STATUS_META } from '../lib/status.js';

export default function Legend() {
  return (
    <div className="mt-5 px-5 py-4 bg-paper-warm border-[1.5px] border-ink flex flex-wrap gap-x-6 gap-y-3 items-center">
      {Object.entries(STATUS_META).map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-ink-soft">
          <span className={`w-3.5 h-3.5 ${meta.bgColor}`}></span>
          {meta.label}
        </div>
      ))}
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-ink-soft">
        <span className="w-3.5 h-3.5 bg-st-medio-extra rounded-full"></span>
        + Horas reposición
      </div>
    </div>
  );
}
