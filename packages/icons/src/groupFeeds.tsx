import type { SVGProps } from "react";

export function GroupFeedsIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="square"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M17.25 6.75v-2a2 2 0 0 0-2-2H4.75a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h2m2.576 4c.461-2.286 2.379-4 4.674-4 2.295 0 4.213 1.714 4.674 4m-9.348 0H8.75a2 2 0 0 1-2-2V8.75a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2h-.576m-9.348 0h9.348M16.25 12.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
			/>
		</svg>
	);
}
