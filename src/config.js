// ============================================================
//  CONFIGURACIÓN GENERAL
// ============================================================
// Este es el único archivo que necesitas editar si quieres cambiar
// las API keys, los pagos, o los empleados.

// ----- API JSONBin (donde se guardan los datos en la nube) -----
export const JSONBIN_BIN_ID = '6a04c6a9250b1311c346adda';
export const JSONBIN_ACCESS_KEY = '$2a$10$CDidfJLX7b7ZiPc98viEt.FIFR0O.YtL7regULAYaz0.S12Bss.Vm';
export const JSONBIN_BASE = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// ----- Pagos (en Quetzales) -----
export const PAY_HALF = 35;              // Pago por medio día
export const PAY_FULL = 70;              // Pago por día completo
export const PAY_PER_HOUR = 35 / 6;      // Pago por hora de reposición (Q5.83)

// ----- Empleados -----
// La 'key' es el identificador interno, 'name' es el que se muestra.
// Para cada empleado se define:
// - cycleType: 'biweekly_19' = ciclo del 19 al 18 / 'monthly' = del 1 al fin de mes
// - worksWeekends: si puede trabajar fines de semana
export const EMPLOYEES = {
  teresa: {
    name: 'Teresa',
    cycleType: 'biweekly_19',
    worksWeekends: false,
  },
  sebas: {
    name: 'Sebas',
    cycleType: 'monthly',
    worksWeekends: true,
  },
};

// Lista de keys de empleados (para iterar fácilmente)
export const EMPLOYEE_KEYS = Object.keys(EMPLOYEES);

// ----- Cache local (para cuando no hay internet) -----
export const STORAGE_CACHE_KEY = 'soluciones_plus_v2_cache';

// ----- Auto-refresh -----
export const AUTO_REFRESH_MS = 60000; // Recargar datos desde la nube cada 60s

// ----- LOGIN -----
// Credenciales para entrar al sistema.
// IMPORTANTE: como esto vive en el navegador, no es 100% seguro,
// sirve como barrera para visitantes casuales.
export const LOGIN_USERNAME = 'SolucionesPlus';
export const LOGIN_PASSWORD = 'SP2021*';

// La sesión dura este tiempo en milisegundos antes de pedir login otra vez.
// Default: 12 horas (43200000 ms). Pon 0 para que dure hasta cerrar el navegador.
export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

// Key para guardar la sesión activa en el navegador
export const SESSION_KEY = 'soluciones_plus_session';
