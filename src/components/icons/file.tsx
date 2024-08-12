import type { SVGProps } from "react";

export function FileIcon(
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
				strokeWidth="1.5"
				d="M12.75 3.25v5a1 1 0 001 1h5m-10 4h3.5m-3.5 4h6.5m-9.5-14.5h6.586a1 1 0 01.707.293l5.914 5.914a1 1 0 01.293.707V20.25a1 1 0 01-1 1H5.75a1 1 0 01-1-1V3.75a1 1 0 011-1z"
			></path>
		</svg>
	);
}
