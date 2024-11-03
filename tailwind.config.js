/** @type {import('tailwindcss').Config} */

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "index.html"],
	theme: {
		extend: {
			keyframes: {
				slideDownAndFade: {
					from: { opacity: 0, transform: "translateY(-2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: "translateX(2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				slideUpAndFade: {
					from: { opacity: 0, transform: "translateY(2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: "translateX(-2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				overlayShow: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				contentShow: {
					from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
					to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
				},
			},
			animation: {
				slideDownAndFade:
					"slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideLeftAndFade:
					"slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideRightAndFade:
					"slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("tailwind-gradient-mask-image"),
		require("tailwindcss-content-visibility"),
	],
};
