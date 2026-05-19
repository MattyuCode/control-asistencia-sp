// ============================================================
//  PUNTO DE ENTRADA
// ============================================================
// React arranca aquí. Toma el componente <App /> y lo monta en
// el div con id="root" del index.html.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// StrictMode: ayuda a detectar problemas durante el desarrollo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
