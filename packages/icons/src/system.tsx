import { SVGProps } from "react";

export function SystemModeIcon(
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
				d="M3.75 12.25V12a8.25 8.25 0 1116.5 0v.25m-18.5 4h20.5m-15.5 4h10.5"
			></path>
		</svg>
	);
}
