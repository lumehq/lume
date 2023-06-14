import { SVGProps } from "react";

export function ThreadIcon(
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
				fill="currentColor"
				d="M7.5 5.75a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM13 5.75a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM7.5 18.25a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM13 18.25a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM7.5 11.9a1.75 1.75 0 113.5 0v.1a1.75 1.75 0 11-3.5 0v-.1zM13 11.9a1.75 1.75 0 113.5 0v.1a1.75 1.75 0 11-3.5 0v-.1z"
			/>
		</svg>
	);
}
