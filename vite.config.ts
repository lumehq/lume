import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";
import topLevelAwait from "vite-plugin-top-level-await";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	clearScreen: false,
	server: {
		strictPort: true,
	},
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		// Tauri uses Chromium on Windows and WebKit on macOS and Linux
		target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
	plugins: [
		react(),
		ssr({ prerender: true }),
		viteTsconfigPaths(),
		topLevelAwait({
			promiseExportName: "__tla",
			promiseImportName: (i) => `__tla_${i}`,
		}),
	],
});
