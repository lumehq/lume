import type { SVGProps } from "react";

export function VisitIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth=".5"
				d="M5.75 8.5a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm3.5 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm3.5 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
			/>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M21.25 12.25v-5.5a2 2 0 0 0-2-2H4.75a2 2 0 0 0-2 2v11.5a2 2 0 0 0 2 2h7.5M22 17.154 15 15l2.154 7 1.615-3.23L22 17.153Z"
			/>
		</svg>
	);
}
