// ============================================================
//  HEADER
// ============================================================
// La parte de arriba: logo, título, indicador de conexión, fecha
// y botón de cerrar sesión.

import { MONTH_NAMES_SHORT } from '../lib/helpers.js';
import logoUrl from '../assets/logo.png';

export default function Header({ connStatus, lastSync, onLogout }) {
  const today = new Date();

  // Definir cómo se ve el indicador de conexión según el estado
  let statusClasses = '';
  let statusText = '';
  if (connStatus === 'online') {
    statusClasses = 'bg-leaf text-paper';
    statusText = lastSync
      ? `☁ Sincronizado · ${lastSync.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}`
      : '☁ Conectado';
  } else if (connStatus === 'saving') {
    statusClasses = 'bg-gold text-ink';
    statusText = '⟳ Guardando...';
  } else {
    statusClasses = 'bg-accent text-paper';
    statusText = '⚠ Sin conexión';
  }

  function handleLogout() {
    if (window.confirm('¿Cerrar sesión?')) {
      onLogout();
    }
  }

  return (
    <header className="border-b-2 border-ink pb-6 mb-7 flex flex-wrap items-end justify-between gap-4">
      {/* Lado izquierdo: logo + marca + título */}
      <div className="flex items-start gap-4">
        {/* Logo (se oculta en móvil para ahorrar espacio) */}
        <div className="bg-ink p-2 border-2 border-ink flex-shrink-0 hidden sm:block">
          <img
            src={logoUrl}
            alt="Soluciones Plus"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />
        </div>

        {/* Texto */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_0_3px_theme(colors.paper),0_0_0_4px_theme(colors.ink)]"></span>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">
              Soluciones Plus · Sistema interno
            </span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl leading-[0.95] tracking-tight">
            Control <span className="italic font-medium text-accent">de asistencia</span>
          </h1>

          <p className="text-sm text-ink-soft mt-2 max-w-md">
            Registro diario de medios días y reposiciones para el cálculo de planilla.
          </p>
        </div>
      </div>

      {/* Lado derecho: fecha, estado y logout */}
      <div className="font-mono text-[10px] tracking-wider text-ink-soft leading-relaxed text-right">
        <strong className="text-ink block text-xs">
          {MONTH_NAMES_SHORT[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </strong>
        Horario · 11:30 – 17:30<br />
        Lunes a viernes
        <div className="flex items-center justify-end gap-2 mt-2 flex-wrap">
          <div className={`inline-block px-2.5 py-1 font-bold text-[9px] tracking-wider uppercase rounded-sm ${statusClasses}`}>
            {statusText}
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="inline-block px-2.5 py-1 font-mono font-bold text-[9px] tracking-wider uppercase bg-ink text-paper border-[1.5px] border-ink hover:bg-accent hover:border-accent transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
