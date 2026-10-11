import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@enterprise-ui/tokens/styles.css';
import '@enterprise-ui/components/style.css';
import './style.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
