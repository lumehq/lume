import { SVGProps } from "react";

export function BellIcon(
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
				strokeWidth="2"
				d="M9.159 17.724a59.522 59.522 0 01-3.733-.297 1.587 1.587 0 01-1.33-2.08c.161-.485.324-.963.367-1.478l.355-4.26a7.207 7.207 0 0114.365 0l.355 4.262c.043.515.206.993.367 1.479a1.587 1.587 0 01-1.33 2.077 59.5 59.5 0 01-3.732.297m-5.684 0c1.893.09 3.79.09 5.684 0m-5.684 0v.434a2.842 2.842 0 105.684 0v-.434"
			/>
		</svg>
	);
}
