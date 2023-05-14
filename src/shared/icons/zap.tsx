import { SVGProps } from "react";

export default function ZapIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M20.25 8.75H13.25V1.75L3.75 15.0473H10.75V22.25L20.25 8.75Z"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinejoin="round"
			/>
		</svg>
	);
}
