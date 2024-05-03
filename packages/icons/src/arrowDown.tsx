import type { SVGProps } from "react";

export function ArrowDownIcon(
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
				d="M6.5 14.17a30.23 30.23 0 005.406 5.62c.174.14.384.21.594.21m6-5.83a30.232 30.232 0 01-5.406 5.62.949.949 0 01-.594.21m0 0V4"
			/>
		</svg>
	);
}
