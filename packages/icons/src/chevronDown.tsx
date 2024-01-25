import { SVGProps } from "react";

export function ChevronDownIcon(
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
				d="M6 9a30.618 30.618 0 005.49 5.817c.3.244.72.244 1.02 0A30.617 30.617 0 0018 9"
			/>
		</svg>
	);
}
