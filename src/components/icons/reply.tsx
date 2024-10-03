import type { SVGProps } from "react";

export const ReplyIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M21.75 12c0-5.156-3.792-8.25-9.75-8.25S2.25 6.844 2.25 12c0 1.337.92 3.605 1.064 3.952l.038.091c.099.27.505 1.71-1.102 3.84 2.167 1.031 4.468-.664 4.468-.664 1.592.84 3.486 1.031 5.282 1.031 5.958 0 9.75-3.094 9.75-8.25z"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
