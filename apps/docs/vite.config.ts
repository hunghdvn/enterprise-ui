import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites at /<repo>/ — assets and the entry HTML
// must be prefixed accordingly. State-based routing (no URL router) means the
// app itself is path-agnostic; only asset URLs need the base.
export default defineConfig({
  base: '/enterprise-ui/',
  plugins: [react()],
  server: { port: 5174 },
});
