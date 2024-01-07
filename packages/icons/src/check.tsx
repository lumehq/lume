import { SVGProps } from "react";

export function CheckIcon(
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
				d="M5 12.713l5.017 5.012.4-.701a28.598 28.598 0 018.7-9.42L20 7"
			/>
		</svg>
	);
}
