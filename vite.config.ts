import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {
	/* ... */
};

export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		tsconfigPaths(),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
	],
	build: {
		outDir: "./dist",
		target: "esnext",
	},
	server: {
		strictPort: true,
		port: 3000,
	},
	clearScreen: false,
});
