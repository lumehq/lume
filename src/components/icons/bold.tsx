import type { SVGProps } from "react";

export function BoldIcon(
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
				strokeLinecap="square"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M13 12H6m7 0a4 4 0 000-8H8a2 2 0 00-2 2v6m7 0h1a4 4 0 010 8H8a2 2 0 01-2-2v-6"
			></path>
		</svg>
	);
}
