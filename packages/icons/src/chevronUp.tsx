import type { SVGProps } from "react";

export function ChevronUpIcon(
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
				d="M6 15a30.617 30.617 0 015.49-5.817.803.803 0 011.02 0A30.616 30.616 0 0118 15"
			/>
		</svg>
	);
}
