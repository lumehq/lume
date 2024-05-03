import type { SVGProps } from "react";

export function TrendingIcon(
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
				d="M15.75 6.75h5.5v5.5m-.514-4.975L13 15l-4-4-6.25 6.25"
			/>
		</svg>
	);
}
