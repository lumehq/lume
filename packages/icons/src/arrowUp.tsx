import type { SVGProps } from "react";

export function ArrowUpIcon(
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
				d="M6 9.83a30.23 30.23 0 015.406-5.62A.949.949 0 0112 4m6 5.83a30.233 30.233 0 00-5.406-5.62A.949.949 0 0012 4m0 0v16"
			/>
		</svg>
	);
}
