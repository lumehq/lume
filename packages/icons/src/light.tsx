import type { SVGProps } from "react";

export function LightIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M11.998 3.29V1.769M5.84 18.158l-1.077 1.078m7.235 2.997v-1.524m7.235-15.944l-1.077 1.077M20.707 12h1.523m-4.074 6.159l1.077 1.077M1.766 12h1.523m1.474-7.235L5.84 5.842m9.87 2.446a5.25 5.25 0 11-7.424 7.424 5.25 5.25 0 017.424-7.424z"
			></path>
		</svg>
	);
}
