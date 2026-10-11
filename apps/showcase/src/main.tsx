import React from 'react';
import { createRoot } from 'react-dom/client';
import '@enterprise-ui/tokens/all.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
