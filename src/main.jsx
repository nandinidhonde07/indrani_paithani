import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Safely clean stale service workers and browser cache without throwing errors
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(r => r.unregister().catch(() => {}));
    }).catch(() => {});
  }
  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name).catch(() => {}));
    }).catch(() => {});
  }
} catch (err) {
  console.warn("Cache cleanup notice:", err);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

