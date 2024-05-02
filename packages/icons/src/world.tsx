import type { SVGProps } from "react";

export function WorldIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M19.7783 4.22184L4.22197 19.7782M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12ZM18.5163 18.516C17.3167 19.7156 13.427 17.7707 9.82826 14.172C6.22955 10.5733 4.28467 6.68352 5.48424 5.48395C6.68381 4.28438 10.5736 6.22927 14.1723 9.82798C17.771 13.4267 19.7159 17.3165 18.5163 18.516Z"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
