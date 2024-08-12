import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), viteTsconfigPaths(), TanStackRouterVite()],
	build: {
		outDir: "../../dist",
	},
	server: {
		strictPort: true,
		port: 3000,
	},
	clearScreen: false,
});
