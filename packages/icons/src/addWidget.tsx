import type { SVGProps } from "react";

export function AddWidgetIcon(
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
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M12.25 21.25h-6.5a1 1 0 01-1-1V3.75a1 1 0 011-1h12.5a1 1 0 011 1v8.5m-1 3v3m0 0v3m0-3h-3m3 0h3"
			/>
		</svg>
	);
}
