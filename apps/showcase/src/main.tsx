import React from 'react';
import { createRoot } from 'react-dom/client';
import '@enterprise-ui/tokens/tokens.css';
import '@enterprise-ui/tokens/theme-light.css';
import '@enterprise-ui/tokens/theme-dark.css';
import '@enterprise-ui/tokens/density.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
