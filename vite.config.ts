import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    ssr({ prerender: true }),
    viteTsconfigPaths(),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  define: {
    global: 'window',
  },
});
