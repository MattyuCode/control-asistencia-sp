# 📖 Guía: Cómo Funciona el Sistema de Ciclos de Pago para Teresa

## Resumen Rápido

**El ciclo de Teresa es del 19 al 18 del mes siguiente:**

```
Ciclo: 19 de Mayo → 18 de Junio
Pago: 18 de Junio
Salario fijo: Q700 (máximo por ciclo)
Tasa: Q35 por medio día
```

---

## Cómo se Calcula el Pago

### Regla Básica
El sistema SIEMPRE acumula desde el **19 del mes anterior** hasta **la fecha actual** (hoy).

### Ejemplo Actual (5 de Junio)

**Viendo MAYO:**
```
Rango: 19 de mayo → 31 de mayo
Muestra: Solo la porción de mayo del ciclo actual
Ejemplo: 9 medios días = Q315
```

**Viendo JUNIO:**
```
Rango: 19 de mayo → 5 de junio (HOY)
Muestra: El ciclo COMPLETO acumulado hasta hoy
Ejemplo: 9 (mayo) + 5 (junio) = 14 medios días = Q490
```

---

## ¿Qué Sucede Cuando Agrego Días?

### Caso 1: Agrego un día entre 1-18 de Junio ✅

**Si agrego 6 de junio:**
```
Antes: 19 may → 5 jun = 14 días = Q490
Después: 19 may → 6 jun = 15 días = Q525
```
**Resultado:** El pago se actualiza automáticamente ✓

### Caso 2: Agrego el 19 de Junio ⚠️

**Si agrego 19 de junio:**
```
Ciclo actual: 19 mayo → 18 junio
El 19 de junio está FUERA de este ciclo
El 19 de junio es el INICIO del PRÓXIMO ciclo

Pago del ciclo actual: SIN CAMBIOS (sigue en Q490)
El 19 de junio se verá en el siguiente ciclo
```
**Resultado:** El pago NO cambia porque es otro ciclo

---

## Visualización en la App

### Antes (Sin Mejoras)
```
Pago del ciclo
19 may → 5 jun
Q490.00
Teresa · próximo pago 18 jun
[Desglose sin contexto]
```
❓ Usuario confundido: ¿Dónde terminan los días de junio?

### Después (Con Mejoras)
```
Pago del ciclo
19 may → 5 jun [EN PROGRESO] ← NUEVO: Sabes que está en progreso
Q490.00
Teresa · cierra 18 jun · próximo pago 18 jun ← NUEVO: Sabes cuándo cierra
Acumulado desde 19 may hasta el período visible ← NUEVO: Sabes qué se cuenta
[Desglose CON contexto]
```
✓ Usuario entiende claramente cómo funciona

---

## Timeline Completo

```
CICLO ANTERIOR PAGADO
┌─ Abril 19 - Mayo 18
│  └─ Q535 pagado (15 días)
│

CICLO ACTUAL EN PROGRESO
┌─ Mayo 19 - Junio 18
│  ├─ Mayo 19-31: 9 días = Q315
│  ├─ Junio 1-5: 5 días = Q175
│  ├─ TOTAL ACUMULADO: Q490
│  └─ Status: EN PROGRESO
│     (Si agregas 6-18 de junio, se suma)
│     (Si agregas 19 de junio, es otro ciclo)
│

PRÓXIMO CICLO (Comenzará el 19 de junio)
┌─ Junio 19 - Julio 18
│  ├─ Comenzará a acumular el 19 de junio
│  └─ Los días 19+ se contarán en este ciclo
│

Timeline de Ejemplo:
─────────────────────────────────────────────
19 may          31 may              5 jun
│               │                   │
CICLO ACTUAL                      HOY
Acumulado hasta aquí = Q490

Si llegas al 18 jun:
│
CIERRA EL CICLO
Se paga Q490 el 18 de junio

Si llegas al 19 jun:
│
NUEVO CICLO INICIA
Se comienza a contar desde cero
```

---

## Preguntas Comunes

### P1: ¿Por qué en mayo veo Q315 y en junio Q490?
**R:** Porque en mayo solo se muestra la porción del ciclo de ese mes (19-31).
En junio se muestra el TOTAL ACUMULADO del ciclo (19 mayo - hoy).
Es normal y correcto.

### P2: ¿El Q315 de mayo "se pierde"?
**R:** No. El Q315 está incluido en Q490. Junio = 315 + 175 = 490.

### P3: ¿Si agrego el 19 de junio, se suma al Q490?
**R:** No. El 19 de junio es primer día del PRÓXIMO ciclo.
Verás un NUEVO ciclo que comienza el 19 de junio.

### P4: ¿Qué pasa el 18 de junio?
**R:** Ese es el último día del ciclo actual. Se cierra y se paga.
El 19 comienza el nuevo ciclo.

### P5: ¿Hay un límite de Q700?
**R:** Sí. Si llegas a Q700 en medios días, se detiene ahí.
Incluso si agregas más días, el máximo es Q700 por ciclo.

---

## Resumen Visual

```
┌──────────────────────────────────────────────────┐
│           CICLO: 19 MAY → 18 JUN               │
│                   EN PROGRESO                    │
├──────────────────────────────────────────────────┤
│  PERIODO VISTO    │   RANGO MOSTRADO   │ PAGO   │
├──────────────────────────────────────────────────┤
│  Mayo (19-31)     │   19 may → 31 may  │ Q315   │
│  Junio (1-18)     │   19 may → hoy     │ Q490   │
│  Junio (19+)      │   NUEVO CICLO      │ Q0+    │
└──────────────────────────────────────────────────┘
```

---

## Conclusión

✅ **El sistema funciona correctamente:**
- Acumula automáticamente desde el 19
- Se actualiza cuando agregas días (1-18)
- Reinicia el 19 con un nuevo ciclo

✅ **Las mejoras en la UI ahora muestran:**
- Estado: "EN PROGRESO"
- Período: "Acumulado desde X hasta el período visible"
- Cierre: Fecha clara de cuándo termina
