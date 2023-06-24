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
	],
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
		minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
		sourcemap: !!process.env.TAURI_DEBUG,
	},
	server: {
		strictPort: true,
		port: 3000,
	},
	clearScreen: false,
});
