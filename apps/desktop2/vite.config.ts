import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		react(),
		viteTsconfigPaths(),
		topLevelAwait({
			promiseExportName: "__tla",
			promiseImportName: (i) => `__tla_${i}`,
		}),
		TanStackRouterVite(),
	],
	build: {
		outDir: "../../dist",
	},
	server: {
		strictPort: true,
		port: 3000,
	},
	clearScreen: false,
});
