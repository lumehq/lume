/** @type {import('tailwindcss').Config} */

import preset from "@lume/tailwindcss";

const config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	presets: [preset],
};

export default config;
