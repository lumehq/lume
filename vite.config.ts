import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), ssr(), viteTsconfigPaths()],
});
