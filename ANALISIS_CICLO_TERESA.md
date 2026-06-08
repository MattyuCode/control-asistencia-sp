# Análisis de Ciclo de Pago - Teresa

## Configuración de Teresa
- **Salario ciclo**: Q700 (tope máximo)
- **Medio día**: Q35
- **Día completo**: Q70
- **Ciclo**: 19 del mes anterior → 18 del mes actual
- **Trabaja**: Lunes a Viernes (días hábiles)

---

## Escenario Actual (5 de Junio de 2026)

Hoy es **5 de junio** (día 5, mes 6, dow = 5 = viernes)

### Ciclo Activo
Puesto que hoy = 5 (< 19), el ciclo activo es:
- **Inicio**: 19 de Mayo
- **Fin**: 18 de Junio
- **Pago**: 18 de Junio

---

## ¿Qué sucede cuando se VE MAYO?

**Rango de cálculo**: Mayo 19 → Mayo 31

Lógica en el código:
```
if (isInActiveCycle) {
  if (mes_visto !== mes_fin_ciclo) {  // Mayo ≠ Junio
    start = activeCycle.start;         // Mayo 19
    end = viewMonthEnd;                // Mayo 31
  }
}
```

**Resultado**: Muestra solo la porción de MAYO del ciclo
- Si Teresa trabajó 9 medios días: 9 × Q35 = **Q315**
- Si trabajó 20 medios días: 20 × Q35 = Q700 (tope)

---

## ¿Qué sucede cuando se VE JUNIO?

**Rango de cálculo**: Mayo 19 → Junio 5 (HOY)

Lógica en el código:
```
if (isInActiveCycle) {
  if (mes_visto === mes_fin_ciclo) {  // Junio === Junio
    start = activeCycle.start;         // Mayo 19
    end = today;                       // Junio 5
  }
}
```

**Resultado**: Muestra el TOTAL ACUMULADO del ciclo activo
- Mayo 19-31: 9 medios días = Q315
- Junio 1-5 (hasta hoy): Si trabajó 2 medios días = Q70
- **Total acumulado**: Q315 + Q70 = **Q385**

---

## Pregunta del Usuario

> "Cuando pasa a junio quiero que siga tomando ese total (Q315) o me sigue mostrando entonces cuando agrego el otro día de junio que se va sumando"

### Interpretación 1: ¿Se mantiene Q315 o se recalcula?
**Respuesta**: Se RECALCULA como acumulado.
- En Mayo: Q315 (solo mayo)
- En Junio: Q315 + lo nuevo de junio (total ciclo)

### Interpretación 2: ¿El Q315 de mayo "se pierde"?
**Respuesta**: NO. El Q315 se suma en el total de junio.
- La vista de Junio incluye TODO el ciclo: mayo + lo que va de junio

---

## Verificación de Lógica

### Caso 1: Viendo Mayo 19-31
```
start = May 19
end = May 31
Suma: todos los días trabados del 19 al 31
```

### Caso 2: Viendo Junio 1-18
```
start = May 19  (inicio del ciclo)
end = Today (Junio 5)
Suma: días del 19 al 31 mayo + días 1 al 5 junio
```

### Caso 3: Viendo Junio 19-30 (después del 18)
```
El ciclo anterior (mayo 19 - junio 18) estaría COMPLETO.
Nuevo ciclo: junio 19 - julio 18
```

---

## Posible Confusión

El usuario podría estar viendo una **discontinuidad visual**:

1. **En Mayo**: Muestra solo mayo → Q315
2. **En Junio**: Muestra todo el ciclo → Q315 + nuevo
3. El usuario esperaría ver "Q315 + nuevo" claramente

**Solución**: El código está correcto. La interfaz podría mejorar mostrando:
- "Ciclo en progreso: Q315 (mayo 19-31) + Q70 (junio 1-5) = Q385"

---

## Verificación Requerida

Para confirmar si hay un bug o solo una confusión:

1. ¿Cuántos días tiene marcados Teresa en Mayo?
2. ¿El cálculo de Q315 es correcto? (debería ser múltiplo de 35 o 70)
3. ¿Cuando se agrega un día en Junio, suma correctamente?
