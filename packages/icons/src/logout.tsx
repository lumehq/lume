import { SVGProps } from "react";

export function LogoutIcon(
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
				d="M5.812 9a15.001 15.001 0 00-2.655 2.556A.703.703 0 003 12m2.812 3a15 15 0 01-2.655-2.556A.703.703 0 013 12m0 0h13m-5-7.472A6 6 0 0121 9v6a6 6 0 01-10 4.472"
			/>
		</svg>
	);
}
