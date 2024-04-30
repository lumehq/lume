import { SVGProps } from "react";

export function AdvancedSettingsIcon(
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
				d="M13.75 7h-10m10 0a3.25 3.25 0 116.5 0 3.25 3.25 0 11-6.5 0zm6.5 10h-8m0 0a3.25 3.25 0 11-6.5 0m6.5 0a3.25 3.25 0 10-6.5 0m0 0h-2"
			></path>
		</svg>
	);
}
