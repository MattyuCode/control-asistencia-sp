// ============================================================
//  TOAST
// ============================================================
// Notificación pequeña que aparece abajo de la pantalla y desaparece sola.

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="
      fixed bottom-5 left-1/2 -translate-x-1/2 z-50
      bg-ink text-paper px-6 py-3.5
      font-mono text-xs tracking-wider uppercase
      border-2 border-ink shadow-brutal-accent
      toast-enter
    ">
      {message}
    </div>
  );
}
