import { SVGProps } from "react";

export default function CancelIcon(
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
				d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
			/>
		</svg>
	);
}
