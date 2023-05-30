import { SVGProps } from "react";

export function BellIcon(
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
				d="M16 18.25C15.3267 20.0159 13.7891 21.25 12 21.25C10.2109 21.25 8.67327 20.0159 8 18.25M20.5 18.25L18.9554 8.67345C18.4048 5.2596 15.458 2.75 12 2.75C8.54203 2.75 5.59523 5.2596 5.04461 8.67345L3.5 18.25H20.5Z"
				stroke="currentColor"
				strokeWidth={1.5}
			/>
		</svg>
	);
}
