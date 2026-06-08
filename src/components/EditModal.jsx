// ============================================================
//  EDIT MODAL
// ============================================================
// Modal que se abre al hacer clic en un día. Permite:
// - Elegir el estado (medio día, completo, falta, etc.)
// - Agregar horas de reposición (0-5)
// - Escribir una nota
// - Guardar o cancelar

import { useState, useEffect } from 'react';
import { STATUS_META } from '../lib/status.js';
import { EMPLOYEES, PAY_PER_HOUR } from '../config.js';
import { MONTH_NAMES, WEEKDAY_NAMES } from '../lib/helpers.js';
import { calculateCyclePay } from '../lib/cycles.js';

export default function EditModal({ editing, onClose, onSave, onPreview, empData }) {
  // Estado local del modal (se inicializa con los valores actuales del día)
  const [status, setStatus] = useState(editing.entry.status || '');
  const [repHours, setRepHours] = useState(editing.entry.repExtra || 0);
  const [note, setNote] = useState(editing.entry.note || '');

  // Tasa dinámica para empleados con salario fijo (Teresa)
  const emp = EMPLOYEES[editing.emp];
  const cycleInfo = emp.monthlySalary ? calculateCyclePay(empData || {}, editing.emp) : null;
  const dailyRate = cycleInfo?.dailyRate || null;
  const hourlyRate = dailyRate ? dailyRate / 6 : PAY_PER_HOUR;

  function getDisplayValue(key, meta) {
    if (!dailyRate) return meta.value;
    if (key === 'medio' || key === 'feriado') return dailyRate;
    if (key === 'completo' || key === 'feriado_trabajado') return dailyRate * 2;
    return meta.value;
  }

  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Actualizar preview cuando cambia status o repHours
  useEffect(() => {
    if (onPreview) {
      const previewEntry = { status: status || null };
      if (repHours > 0) previewEntry.repExtra = repHours;
      onPreview(previewEntry);
    }
  }, [status, repHours, onPreview]);

  // Cuando hacen clic en Guardar
  function handleSave() {
    const trimmedNote = note.trim();
    if (!status && !trimmedNote && !repHours) {
      // Nada seleccionado: limpiar el día
      onSave(null);
      return;
    }
    const entry = { status: status || null };
    if (trimmedNote) entry.note = trimmedNote;
    if (repHours > 0) entry.repExtra = repHours;
    onSave(entry);
  }

  // Cerrar al hacer clic en el fondo (no en el modal en sí)
  function handleBgClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const date = new Date(editing.y, editing.m, editing.d);
  const weekdayName = WEEKDAY_NAMES[date.getDay()];

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBgClick}
    >
      <div className="bg-paper border-2 border-ink shadow-[10px_10px_0_theme(colors.accent)] w-full max-w-[520px] p-7 relative max-h-[90vh] overflow-y-auto">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 bg-transparent border-none text-xl cursor-pointer text-ink font-serif px-2 hover:text-accent transition-colors"
        >
          ×
        </button>

        {/* Cabecera del día */}
        <div className="font-mono text-[10px] tracking-wider uppercase text-ink-soft mb-1.5">
          {weekdayName}
        </div>
        <div className="font-serif text-3xl font-bold leading-none">
          {editing.d} de {MONTH_NAMES[editing.m].toLowerCase()}
        </div>
        <div className="text-sm text-ink-soft mt-1.5 mb-6">
          Empleado: <strong className="text-accent font-bold">{EMPLOYEES[editing.emp].name}</strong>
        </div>

        {/* Opciones de estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
          {Object.entries(STATUS_META).map(([key, meta]) => {
            const isSelected = status === key;
            return (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`
                  px-3 py-2.5 border-[1.5px] border-ink cursor-pointer
                  font-mono text-[9.5px] tracking-wider uppercase text-left
                  flex items-center gap-2.5 font-semibold transition-colors
                  ${isSelected ? 'bg-ink text-paper' : 'bg-paper-warm hover:bg-paper text-ink'}
                `}
              >
                <span className={`w-3.5 h-3.5 ${meta.bgColor} flex-shrink-0`}></span>
                {meta.label}{meta.value > 0 ? ` · Q${getDisplayValue(key, meta).toFixed(2)}` : ''}
              </button>
            );
          })}
          <button
            onClick={() => setStatus('')}
            className={`
              sm:col-span-2 px-3 py-2.5 border-[1.5px] border-ink border-dashed
              cursor-pointer font-mono text-[9.5px] tracking-wider uppercase
              flex items-center justify-center gap-2.5 font-semibold
              transition-colors
              ${status === '' ? 'bg-ink text-paper' : 'bg-transparent hover:bg-paper text-ink'}
            `}
          >
            Limpiar registro
          </button>
        </div>

        {/* Sección de horas de reposición */}
        <div className="mt-4 pt-4 border-t-[1.5px] border-ink border-dashed">
          <label className="block font-mono text-[9.5px] tracking-wider uppercase text-ink-soft mb-1.5">
            + Horas de reposición ese día
          </label>
          <div className="text-[11px] text-ink-soft mb-2.5 italic leading-snug">
            Si se quedó después de su horario, cada hora paga Q{hourlyRate.toFixed(2)} y descuenta 1h del saldo pendiente.
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map(h => (
              <button
                key={h}
                onClick={() => setRepHours(h)}
                className={`
                  py-2.5 px-1 border-[1.5px] border-ink cursor-pointer
                  font-mono text-[9.5px] font-bold text-center transition-colors
                  ${repHours === h
                    ? 'bg-st-medio-extra text-paper border-st-medio-extra'
                    : 'bg-paper-warm hover:bg-paper text-ink'}
                `}
              >
                {h === 0 ? '—' : `+${h}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <label className="block font-mono text-[9.5px] tracking-wider uppercase text-ink-soft mt-4 mb-1.5">
          Observaciones
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. Reposición del día 4 de mayo..."
          className="w-full px-3 py-2.5 border-[1.5px] border-ink bg-paper-warm font-sans text-sm resize-y min-h-[60px] text-ink focus:outline-none focus:bg-paper"
        />

        {/* Botones de acción */}
        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border-[1.5px] border-ink bg-paper cursor-pointer font-mono text-[10px] tracking-wider uppercase font-medium hover:bg-ink hover:text-paper transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 border-[1.5px] border-accent bg-accent text-paper cursor-pointer font-mono text-[10px] tracking-wider uppercase font-medium hover:bg-accent-deep hover:border-accent-deep transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
