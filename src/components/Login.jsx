// ============================================================
//  LOGIN
// ============================================================
// Pantalla de inicio de sesión. Se muestra si el usuario no está
// autenticado. Cuando entran correctamente, llama a onLogin().

import { useState } from 'react';
import { checkCredentials, saveSession } from '../lib/auth.js';
import logoUrl from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pequeño delay para que se vea el "Verificando..." (UX)
    setTimeout(() => {
      if (checkCredentials(username, password)) {
        saveSession();
        onLogin();
      } else {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      {/* Fondo decorativo con la paleta */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-st-medio/10 rounded-full blur-3xl"></div>
      </div>

      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo arriba */}
        <div className="flex justify-center mb-8">
          <div className="bg-ink p-6 border-2 border-ink shadow-brutal-accent rounded-full">
            <img
              src={logoUrl}
              alt="Soluciones Plus"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* Marca + título */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">
              Sistema interno
            </span>
            <span className="w-2 h-2 bg-accent rounded-full"></span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl tracking-tight text-ink">
            Iniciar <span className="italic font-medium text-accent">sesión</span>
          </h1>
          <p className="text-sm text-ink-soft mt-2">
            Ingresa tus credenciales para acceder al control de asistencia
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-paper-warm border-2 border-ink p-7 shadow-brutal"
        >
          {/* Campo usuario */}
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-wider uppercase text-ink-soft mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full px-3.5 py-3 border-[1.5px] border-ink bg-paper font-sans text-base text-ink focus:outline-none focus:bg-white focus:border-accent transition-colors disabled:opacity-50"
            />
          </div>

          {/* Campo contraseña con botón mostrar/ocultar */}
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-wider uppercase text-ink-soft mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full px-3.5 py-3 pr-20 border-[1.5px] border-ink bg-paper font-sans text-base text-ink focus:outline-none focus:bg-white focus:border-accent transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 font-mono text-[9px] tracking-wider uppercase text-ink-soft hover:text-accent transition-colors"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 bg-accent/15 border-[1.5px] border-accent px-3.5 py-2.5">
              <span className="font-mono text-[10px] tracking-wider uppercase text-accent-deep font-bold">
                ⚠ {error}
              </span>
            </div>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3.5 border-[1.5px] cursor-pointer
              font-mono text-xs tracking-wider uppercase font-bold
              transition-colors
              ${loading
                ? 'bg-ink/50 border-ink/50 text-paper/70 cursor-wait'
                : 'bg-accent text-paper border-accent hover:bg-accent-deep hover:border-accent-deep'}
            `}
            
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        {/* Footer con slogan */}
        <div className="text-center mt-6">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink-soft italic">
            "Haciendo posible lo imposible"
          </p>
        </div>
      </div>
    </div>
  );
}
