# Control de Asistencia - Soluciones Plus

Sistema de control de asistencia y pagos para los empleados de Soluciones Plus.
Construido con React + Vite + Tailwind CSS. Los datos se sincronizan con JSONBin
para que se vean en cualquier dispositivo.

---

## 📋 Lo que necesitas instalado

- **Node.js** (versión 18 o superior). Verifica que lo tienes corriendo:
  ```bash
  node --version
  ```

---

## 🚀 Cómo empezar (primera vez)

### 1. Abrir una terminal dentro de esta carpeta

Si estás en Windows: clic derecho dentro de la carpeta → "Abrir en terminal"
Si estás en Mac: arrastra la carpeta sobre la app Terminal

### 2. Instalar dependencias (solo una vez)

```bash
npm install
```

Esto descarga React, Vite, Tailwind y todo lo necesario. Tarda unos 1-2 minutos.
Verás aparecer una carpeta nueva llamada `node_modules` con ~200 MB. No la borres.

### 3. Arrancar el modo desarrollo

```bash
npm run dev
```

Te aparecerá un link tipo `http://localhost:5173`. Ábrelo en el navegador.
Cualquier cambio que hagas en los archivos se verá AL INSTANTE sin recargar.

### 4. Generar la versión final (cuando termines de editar)

```bash
npm run build
```

Te creará una carpeta llamada `dist/` con un solo `index.html` y los archivos
necesarios. Ese es el archivo que distribuyes a tus dispositivos.

Para probar el build localmente antes de distribuir:

```bash
npm run preview
```

---

## 📂 Estructura del proyecto

```
control-soluciones-plus/
├── README.md                      ← Esto que estás leyendo
├── package.json                   ← Lista de dependencias
├── vite.config.js                 ← Configuración de Vite
├── tailwind.config.js             ← Colores y tema de Tailwind
├── postcss.config.js              ← Procesador de CSS
├── index.html                     ← HTML inicial
└── src/
    ├── main.jsx                   ← Punto de entrada (React arranca aquí)
    ├── App.jsx                    ← Componente raíz que junta todo
    ├── index.css                  ← Importa Tailwind + fuentes
    ├── config.js                  ← ⚠️ CONFIGURACIÓN: API keys, pagos, empleados
    │
    ├── lib/                       ← Funciones de utilidad (no son componentes)
    │   ├── storage.js             ← Lee y escribe en JSONBin
    │   ├── cycles.js              ← Lógica de los ciclos de pago
    │   ├── helpers.js             ← Funciones de fechas y formato
    │   └── status.js              ← Definiciones de estados (medio día, falta, etc.)
    │
    └── components/                ← Cada parte visual es un componente
        ├── Header.jsx             ← Cabecera con título y estado de conexión
        ├── EmployeeTabs.jsx       ← Pestañas Teresa / Sebas
        ├── MonthNav.jsx           ← Navegación entre meses
        ├── Calendar.jsx           ← Cuadrícula del calendario
        ├── DayCell.jsx            ← Una celda de día individual
        ├── PayPanel.jsx           ← Panel del pago del ciclo (lateral)
        ├── ReposicionPanel.jsx    ← Panel del saldo de reposición
        ├── SummaryPanel.jsx       ← Resumen del mes
        ├── Legend.jsx             ← Leyenda de colores
        ├── EditModal.jsx          ← Modal para editar un día
        └── Toast.jsx              ← Mensajes flotantes
```

---

## 🎨 Cómo funciona Tailwind CSS

Tailwind te permite escribir estilos directo en el HTML/JSX con clases cortas.
Ejemplo:

```jsx
<button className="bg-accent text-paper px-4 py-2 hover:bg-accent-deep">
  Click aquí
</button>
```

Eso equivale a:

```css
button {
  background: var(--accent);
  color: var(--paper);
  padding: 0.5rem 1rem;
}
button:hover { background: var(--accent-deep); }
```

Los colores personalizados (`accent`, `paper`, `ink`, etc.) están definidos en
`tailwind.config.js`. Si quieres cambiar la paleta, edítalo ahí.

### Documentación rápida de Tailwind:
- https://tailwindcss.com/docs/utility-first
- Buscador de clases: https://tailwindcomponents.com/cheatsheet/

---

## 🛠️ Cómo hacer cambios comunes

### Cambiar el pago por medio día
Edita `src/config.js`:
```js
export const PAY_HALF = 35;  // cambia este número
```

### Cambiar las API keys de JSONBin
Edita `src/config.js`:
```js
export const JSONBIN_BIN_ID = 'tu-bin-id';
export const JSONBIN_ACCESS_KEY = 'tu-access-key';
```

### Agregar un nuevo estado (por ejemplo "MEDIA JORNADA")
Edita `src/lib/status.js` y añade un nuevo objeto al `STATUS_META`.

### Cambiar colores de la paleta
Edita `tailwind.config.js` en la sección `theme.extend.colors`.

### Cambiar el ciclo de pago
Edita `src/lib/cycles.js`. La función `getCycle` decide los rangos por empleado.

---

## 🔐 Login

La app requiere usuario y contraseña para entrar. Los valores por defecto son:

- **Usuario:** `SolucionesPlus`
- **Contraseña:** `SP2021*`

Para cambiarlos, edita `src/config.js`:
```js
export const LOGIN_USERNAME = 'NuevoUsuario';
export const LOGIN_PASSWORD = 'NuevaContraseña';
```

La sesión dura **12 horas** por defecto. Para cambiar:
```js
export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;  // 12 horas en ms
// O 0 para que dure solo hasta cerrar el navegador
```

⚠️ **Nota de seguridad:** como la app vive en el navegador (sin servidor),
las credenciales están dentro del código compilado. Esto sirve como
barrera para visitantes casuales, NO como seguridad real. Para mayor
protección, no compartas el archivo HTML públicamente y considera
cambiar las credenciales si sospechas que se filtraron.

---

## ☁️ Sobre los datos en la nube

- Los datos viven en JSONBin (no en tu navegador)
- Cualquier cambio se guarda automáticamente
- Si pierdes conexión, sigue guardando en local y reintenta solo
- Cada 60 segundos verifica si hay cambios desde otro dispositivo

### ⚠️ Importante: no subas el archivo a internet público
El `config.js` tiene tu Access Key. Si alguien con el archivo entra a tu Bin,
podría modificar los datos. Compártelo solo con tu equipo de confianza.

---

## 📦 Cómo distribuir a otros dispositivos

1. Corre `npm run build`
2. En la carpeta `dist/` te queda un `index.html` + archivos
3. Comprime la carpeta `dist/` completa en un ZIP
4. Envía el ZIP por WhatsApp, correo o Drive
5. En el otro dispositivo: descomprime y abre `index.html` con doble clic

O si solo lo quieres usar tú: copia la carpeta `dist/` a un USB y la abres
donde quieras.

---

## 🐛 Problemas comunes

### "command not found: npm"
No tienes Node.js instalado o no está en el PATH. Reinstala desde
https://nodejs.org/

### "Cannot find module 'react'"
No corriste `npm install`. Corre el comando dentro de la carpeta del proyecto.

### El navegador no muestra nada cuando hago `npm run dev`
- Revisa que la terminal no muestre errores
- Abre la consola del navegador (F12) para ver si hay errores de JS

### Los datos no se sincronizan
- Verifica que tu Access Key y Bin ID en `config.js` sean correctos
- Abre la consola del navegador (F12) para ver el error específico
- Verifica tu conexión a internet

---

## 📝 Notas finales

Este proyecto fue construido con la ayuda de Claude. Si necesitas hacer
cambios mayores, podés volver a pedirle ayuda compartiendo el código.

Diviértete editando 🎨
