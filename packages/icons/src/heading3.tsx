import { SVGProps } from "react";

export function Heading3Icon(
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
				d="M13 5v7m0 0v7m0-7H3m0-7v7m0 0v7m15.268-7A2 2 0 0122 13a2 2 0 01-2 2 2 2 0 11-1.732 3"
			></path>
		</svg>
	);
}
