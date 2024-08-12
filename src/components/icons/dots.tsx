import type { SVGProps } from "react";

export function DotsPattern(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg {...props}>
			<pattern
				id="pattern-circles"
				width="30"
				height="30"
				x="0"
				y="0"
				patternContentUnits="userSpaceOnUse"
				patternUnits="userSpaceOnUse"
			>
				<circle cx="2" cy="2" r="1.626" fill="currentColor"></circle>
			</pattern>
			<rect
				width="100%"
				height="100%"
				x="0"
				y="0"
				fill="url(#pattern-circles)"
			></rect>
		</svg>
	);
}
