/** @type {import('tailwindcss').Config} */

import preset from "@lume/tailwindcss";

const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"../../packages/@columns/**/*{.js,.ts,.jsx,.tsx}",
		"../../packages/ark/**/*{.js,.ts,.jsx,.tsx}",
		"../../packages/ui/**/*{.js,.ts,.jsx,.tsx}",
		"index.html",
	],
	presets: [preset],
};

export default config;
