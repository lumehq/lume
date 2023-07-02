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
				strokeWidth="1.5"
				d="M20.25 12H9m11.25 0l-4.5 4.5m4.5-4.5l-4.5-4.5m-4.5 12.75h-6.5a1 1 0 01-1-1V4.75a1 1 0 011-1h6.5"
			/>
		</svg>
	);
}
