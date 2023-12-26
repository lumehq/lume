import sharedConfig from "@lume/tailwindcss";

const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"../../packages/@columns/**/*{.js,.ts,.jsx,.tsx}",
		"../../packages/ark/**/*{.js,.ts,.jsx,.tsx}",
		"../../packages/ui/**/*{.js,.ts,.jsx,.tsx}",
		"index.html",
	],
	presets: [sharedConfig],
};

export default config;
