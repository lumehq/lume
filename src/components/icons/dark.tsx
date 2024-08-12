import type { SVGProps } from "react";

export function DarkIcon(
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
				d="M21.248 11.811a6.5 6.5 0 01-9.06-9.06 9.25 9.25 0 109.06 9.06z"
			></path>
		</svg>
	);
}
