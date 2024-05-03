import type { SVGProps } from "react";

export function SecureIcon(
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
				strokeWidth="1.5"
				d="M20.25 6.22a1 1 0 00-.684-.948l-7.25-2.417a1 1 0 00-.632 0l-7.25 2.417a1 1 0 00-.684.949v5.691c0 4.973 4.25 7.338 8.25 9.496 4-2.158 8.25-4.523 8.25-9.496V6.221z"
			></path>
		</svg>
	);
}
