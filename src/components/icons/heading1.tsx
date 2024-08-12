import type { SVGProps } from "react";

export function Heading1Icon(
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
				strokeWidth="2"
				d="M3 5v7m0 7v-7m10-7v7m0 7v-7m0 0H3m15 1.5l3-2.5v8"
			></path>
		</svg>
	);
}
