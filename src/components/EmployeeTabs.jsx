// ============================================================
//  EMPLOYEE TABS
// ============================================================
// Pestañas para alternar entre Teresa y Sebas.

import { EMPLOYEES, EMPLOYEE_KEYS, PAY_HALF } from '../config.js';
import { calculateCyclePay } from '../lib/cycles.js';

export default function EmployeeTabs({ currentEmp, onSelect, data }) {
  return (
    <div className="grid grid-cols-2 border-2 border-ink mb-6">
      {EMPLOYEE_KEYS.map((key, idx) => {
        const emp = EMPLOYEES[key];
        const isActive = currentEmp === key;
        const isLast = idx === EMPLOYEE_KEYS.length - 1;

        let displayRate = PAY_HALF;
        if (emp.monthlySalary && data) {
          const c = calculateCyclePay(data[key], key);
          if (c.dailyRate) displayRate = c.dailyRate;
        }

        return (
          <div
            key={key}
            onClick={() => onSelect(key)}
            className={`
              px-5 sm:px-7 py-4 sm:py-5 cursor-pointer
              transition-colors duration-200
              flex items-center justify-between gap-4
              ${isActive ? 'bg-ink text-paper' : 'bg-paper-warm hover:bg-paper'}
              ${!isLast ? 'border-r-2 border-ink' : ''}
            `}
          >
            <div className="font-serif font-semibold text-xl sm:text-2xl tracking-tight">
              {emp.name}
            </div>
            <div className={`text-right font-mono text-[9px] tracking-wider uppercase leading-relaxed ${isActive ? 'opacity-90' : 'opacity-85'}`}>
              Pago x medio día
              <div className={`font-serif font-bold text-base sm:text-lg normal-case tracking-normal mt-0.5 ${isActive ? 'text-gold' : 'text-ink'}`}>
                Q{displayRate % 1 === 0 ? displayRate.toFixed(2) : displayRate.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
