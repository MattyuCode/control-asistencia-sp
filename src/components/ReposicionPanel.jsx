// ============================================================
//  REPOSICIÓN PANEL
// ============================================================
// Muestra el saldo acumulado: horas perdidas, repuestas y pendientes.

import { calculateReposicion } from '../lib/cycles.js';

export default function ReposicionPanel({ empData }) {
  const r = calculateReposicion(empData);

  // Determinar mensaje y color según el saldo
  let statusText, statusColor, pendColor;
  if (r.horasPerdidas === 0) {
    statusText = 'Sin pendientes';
    statusColor = 'text-leaf';
    pendColor = 'text-gold';
  } else if (r.pendiente === 0) {
    statusText = '¡Al día!';
    statusColor = 'text-leaf';
    pendColor = 'text-gold';
  } else {
    statusText = `Faltan ${r.pendiente}h por reponer`;
    statusColor = 'text-accent';
    pendColor = 'text-paper';
  }

  // Porcentaje de barra de progreso
  const pct = r.horasPerdidas === 0
    ? 100
    : Math.min(100, (r.horasRepuestas / r.horasPerdidas) * 100);

  // Texto del subtítulo de horas repuestas
  const repPartes = [];
  if (r.completos > 0) {
    repPartes.push(`${r.completos} día${r.completos !== 1 ? 's' : ''} completo${r.completos !== 1 ? 's' : ''}`);
  }
  if (r.totalHorasExtra > 0) {
    repPartes.push(`${r.totalHorasExtra}h extras`);
  }
  const repSub = repPartes.length ? repPartes.join(' + ') : '—';

  return (
    <div className="relative bg-paper border-2 border-ink p-6 shadow-brutal-leaf">
      <span className="absolute -top-2.5 left-4 bg-paper-warm px-2 font-mono text-[10px] tracking-wider uppercase text-ink-soft">
        Saldo de reposición
      </span>

      {/* Estado principal */}
      <div className={`font-serif font-bold text-xl mb-3 ${statusColor}`}>
        {statusText}
      </div>

      {/* Barra de progreso */}
      <div className="h-2 bg-ink/10 border border-ink mb-4 overflow-hidden">
        <div
          className="h-full bg-leaf transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Grid de 2 celdas: perdidas / repuestas */}
      <div className="grid grid-cols-2 gap-px bg-ink border border-ink mb-3">
        <div className="bg-paper-warm p-3">
          <div className="font-serif font-bold text-2xl leading-none text-accent">
            {r.horasPerdidas}h
          </div>
          <div className="font-mono text-[9px] tracking-wider uppercase text-ink-soft mt-1.5">
            Horas perdidas
          </div>
          <div className="text-[10px] text-muted mt-1">
            {r.faltas} falta{r.faltas !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-paper-warm p-3">
          <div className="font-serif font-bold text-2xl leading-none text-leaf">
            {r.horasRepuestas}h
          </div>
          <div className="font-mono text-[9px] tracking-wider uppercase text-ink-soft mt-1.5">
            Horas repuestas
          </div>
          <div className="text-[10px] text-muted mt-1">{repSub}</div>
        </div>
      </div>

      {/* Pendiente por reponer */}
      <div className="bg-ink text-paper p-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider uppercase text-paper/80">
          Pendiente por reponer
        </span>
        <span className={`font-serif font-bold text-xl ${pendColor}`}>
          {r.pendiente}h
        </span>
      </div>
    </div>
  );
}
