import type { SVGProps } from "react";

export const RepostIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M10.75 1.5l3.5 3.25L10.75 8m2.5 8l-3.5 3.25 3.5 3.25m-2.5-3.25H14a7.25 7.25 0 004.755-12.723M13.25 4.75H10a7.25 7.25 0 00-4.754 12.724"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
