import { SVGProps } from "react";

export function ItalicIcon(
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
				d="M10 4h4.5M19 4h-4.5m0 0l-5 16m0 0H5m4.5 0H14"
			></path>
		</svg>
	);
}
