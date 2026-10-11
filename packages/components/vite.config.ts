import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      tsconfigPath: resolve(process.cwd(), 'tsconfig.json'),
    }),
  ],
  build: {
    lib: {
      entry: resolve(process.cwd(), 'src/index.ts'),
      name: 'EnterpriseUIComponents',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
});
