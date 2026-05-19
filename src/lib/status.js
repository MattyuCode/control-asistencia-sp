// ============================================================
//  ESTADOS DE ASISTENCIA
// ============================================================
// Cada estado define cómo se paga y cómo afecta al saldo de reposición.
//
// CAMPOS:
// - label: texto que aparece en la lista de selección
// - short: texto corto que aparece en la celda del calendario
// - value: cuántos quetzales paga ese estado
// - hours: horas que realmente trabajó
// - repHoursBase: horas que repone automáticamente este estado
//                 (un "día completo" repone 6h por defecto)
// - lostHours: horas que pierde (una falta = 6h perdidas)
// - colorClass: clase de Tailwind para el fondo del badge

import { PAY_HALF, PAY_FULL } from '../config.js';

export const STATUS_META = {
  medio: {
    label: 'Medio día',
    short: 'MEDIO DÍA',
    value: PAY_HALF,
    hours: 6,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-medio',
    textColor: 'text-paper',
  },
  completo: {
    label: 'Día completo',
    short: 'COMPLETO',
    value: PAY_FULL,
    hours: 10,
    repHoursBase: 6,
    lostHours: 0,
    bgColor: 'bg-st-completo',
    textColor: 'text-ink',
  },
  falta: {
    label: 'Falta',
    short: 'FALTA',
    value: 0,
    hours: 0,
    repHoursBase: 0,
    lostHours: 6,
    bgColor: 'bg-st-falta',
    textColor: 'text-paper',
  },
  vacaciones: {
    label: 'Vacaciones',
    short: 'VACACIONES',
    value: 0,
    hours: 0,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-vacaciones',
    textColor: 'text-paper',
  },
  permiso: {
    label: 'Permiso',
    short: 'PERMISO',
    value: 0,
    hours: 0,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-permiso',
    textColor: 'text-paper',
  },
  enfermedad: {
    label: 'Enfermedad',
    short: 'ENFERMEDAD',
    value: 0,
    hours: 0,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-enfermedad',
    textColor: 'text-paper',
  },
  feriado: {
    label: 'Feriado (no trab.)',
    short: 'FERIADO',
    value: PAY_HALF,
    hours: 0,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-feriado',
    textColor: 'text-paper',
  },
  feriado_trabajado: {
    label: 'Feriado trabajado',
    short: 'FER. TRAB.',
    value: PAY_FULL,
    hours: 6,
    repHoursBase: 0,
    lostHours: 0,
    bgColor: 'bg-st-feriado-trab',
    textColor: 'text-paper',
  },
};

// Lista de keys de estados para iterar fácilmente
export const STATUS_KEYS = Object.keys(STATUS_META);
