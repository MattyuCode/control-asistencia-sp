// ============================================================
//  COMPONENTE RAÍZ - App.jsx
// ============================================================
// Aquí vive el ESTADO PRINCIPAL de la aplicación:
// - data: los datos de los empleados (lo que está en JSONBin)
// - currentEmp: qué empleado se está viendo
// - viewYear/viewMonth: qué mes se está mostrando
// - editing: si hay un día abierto en el modal
// - connStatus: estado de conexión con la nube
//
// El estado se pasa a los componentes hijos como "props".

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFromCloud, saveToCloud, loadLocalCache, saveLocalCache } from './lib/storage.js';
import { dateKey, parseKey } from './lib/helpers.js';
import { isAuthenticated, logout } from './lib/auth.js';
import { AUTO_REFRESH_MS, EMPLOYEE_KEYS } from './config.js';

import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import EmployeeTabs from './components/EmployeeTabs.jsx';
import MonthNav from './components/MonthNav.jsx';
import Calendar from './components/Calendar.jsx';
import PayPanel from './components/PayPanel.jsx';
import ReposicionPanel from './components/ReposicionPanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import Legend from './components/Legend.jsx';
import EditModal from './components/EditModal.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  // ========== ESTADO DE AUTENTICACIÓN ==========
  // Si no está autenticado, mostramos el Login.
  // Si lo está, mostramos toda la app normal.
  const [authed, setAuthed] = useState(() => isAuthenticated());

  // Si no está autenticado, mostrar pantalla de login y nada más
  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return <MainApp onLogout={() => { logout(); setAuthed(false); }} />;
}

// ============================================================
//  COMPONENTE PRINCIPAL (después del login)
// ============================================================
function MainApp({ onLogout }) {
  // ========== ESTADO ==========
  // useState() es como una "variable" especial que React vigila.
  // Cuando cambia, React vuelve a dibujar la pantalla.

  // Los datos de los empleados (la "base de datos" en memoria)
  const [data, setData] = useState(() => loadLocalCache());

  // Empleado que se está mostrando
  const [currentEmp, setCurrentEmp] = useState('teresa');

  // Mes/año visible en el calendario
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Día siendo editado en el modal (null = modal cerrado)
  const [editing, setEditing] = useState(null);

  // Vista previa del entry mientras se edita (para mostrar cambios en tiempo real)
  const [previewEntry, setPreviewEntry] = useState(null);

  // Estado de conexión: 'online' | 'saving' | 'offline'
  const [connStatus, setConnStatus] = useState('online');
  const [lastSync, setLastSync] = useState(null);

  // Mensaje toast (notificación temporal)
  const [toast, setToast] = useState('');

  // Ref para evitar guardados simultáneos
  const isSavingRef = useRef(false);

  // ========== FUNCIONES ==========

  // Mostrar toast (notificación que desaparece sola)
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  // Cargar datos desde la nube
  const refreshFromCloud = useCallback(async () => {
    setConnStatus('saving');
    const cloud = await loadFromCloud();
    if (cloud) {
      setData(cloud);
      saveLocalCache(cloud);
      setLastSync(new Date());
      setConnStatus('online');
      return true;
    } else {
      setConnStatus('offline');
      return false;
    }
  }, []);

  // Guardar cambios en un día específico
  const saveEntry = useCallback(async (emp, dKey, entry) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    // Actualizar el estado local primero (UI responde rápido)
    const newData = {
      ...data,
      [emp]: { ...data[emp] }
    };
    if (!entry || (!entry.status && !entry.note && !entry.repExtra)) {
      delete newData[emp][dKey];
    } else {
      newData[emp][dKey] = entry;
    }
    setData(newData);
    saveLocalCache(newData);

    // Guardar en la nube
    setConnStatus('saving');
    const ok = await saveToCloud(newData);
    if (ok) {
      setLastSync(new Date());
      setConnStatus('online');
      showToast('Guardado en la nube');
    } else {
      setConnStatus('offline');
      showToast('Error al guardar - reintentando');
      // Reintentar en 5 segundos
      setTimeout(() => saveToCloud(newData), 5000);
    }
    isSavingRef.current = false;
  }, [data, showToast]);

  // Limpiar todos los registros del mes actualmente visible
  const clearMonth = useCallback(async () => {
    if (!window.confirm(`¿Limpiar todos los registros del mes visible?`)) return;
    const newData = { ...data, [currentEmp]: { ...data[currentEmp] } };
    Object.keys(newData[currentEmp]).forEach(key => {
      const { y, m } = parseKey(key);
      if (y === viewYear && m === viewMonth) {
        delete newData[currentEmp][key];
      }
    });
    setData(newData);
    saveLocalCache(newData);
    setConnStatus('saving');
    const ok = await saveToCloud(newData);
    setConnStatus(ok ? 'online' : 'offline');
    if (ok) setLastSync(new Date());
    showToast(ok ? 'Mes limpiado' : 'Error al limpiar');
  }, [data, currentEmp, viewYear, viewMonth, showToast]);

  // ========== EFECTOS ==========
  // useEffect() corre código cuando ciertas cosas cambian.

  // Al montar la app: cargar datos desde la nube
  useEffect(() => {
    refreshFromCloud().then(ok => {
      if (ok) showToast('Sincronizado con la nube');
      else showToast('Trabajando con datos locales');
    });
  }, []); // [] significa "solo correr una vez al inicio"

  // Auto-refresh cada N segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editing && !isSavingRef.current) {
        refreshFromCloud();
      }
    }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [editing, refreshFromCloud]);

  // Navegación con flechas del teclado
  useEffect(() => {
    function handleKey(e) {
      if (editing) {
        if (e.key === 'Escape') setEditing(null);
        return;
      }
      if (e.key === 'ArrowLeft') prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // ========== HANDLERS DE NAVEGACIÓN ==========

  function prevMonth() {
    setViewMonth(m => {
      if (m === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function nextMonth() {
    setViewMonth(m => {
      if (m === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function goToday() {
    const t = new Date();
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth());
  }

  // Abrir el modal de edición de un día
  function openDay(y, m, d) {
    const key = dateKey(y, m, d);
    const entry = (data[currentEmp] || {})[key] || {};
    setEditing({ emp: currentEmp, key, y, m, d, entry });
  }

  // ========== RENDER ==========

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-16">

      <Header
        connStatus={connStatus}
        lastSync={lastSync}
        onLogout={onLogout}
      />

      <EmployeeTabs
        currentEmp={currentEmp}
        onSelect={setCurrentEmp}
        data={data}
      />

      <MonthNav
        viewYear={viewYear}
        viewMonth={viewMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={goToday}
        onRefresh={() => refreshFromCloud().then(ok => ok && showToast('Actualizado'))}
        onClearMonth={clearMonth}
      />

      {/* Layout principal: calendario + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

        <div>
          <Calendar
            year={viewYear}
            month={viewMonth}
            empKey={currentEmp}
            empData={data[currentEmp] || {}}
            onDayClick={openDay}
          />
          <Legend />
        </div>

        <aside className="flex flex-col gap-5">
          <PayPanel
            empKey={currentEmp}
            empData={data[currentEmp] || {}}
            previewEntry={previewEntry}
            editingKey={editing?.key}
            viewYear={viewYear}
            viewMonth={viewMonth}
          />
          <ReposicionPanel
            empData={data[currentEmp] || {}}
          />
          <SummaryPanel
            empData={data[currentEmp] || {}}
            year={viewYear}
            month={viewMonth}
          />
        </aside>
      </div>

      {/* Modal de edición (solo si hay un día siendo editado) */}
      {editing && (
        <EditModal
          editing={editing}
          empData={data[editing.emp] || {}}
          onClose={() => {
            setEditing(null);
            setPreviewEntry(null);
          }}
          onPreview={setPreviewEntry}
          onSave={(entry) => {
            saveEntry(editing.emp, editing.key, entry);
            setEditing(null);
            setPreviewEntry(null);
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
