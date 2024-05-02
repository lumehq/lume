import type { SVGProps } from "react";

export function CheckIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
				d="M4.75 12.777 10 19.25l9.25-14.5"
			/>
		</svg>
	);
}
