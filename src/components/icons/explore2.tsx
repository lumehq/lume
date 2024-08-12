import type { SVGProps } from "react";

export function Explore2Icon(
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
				fill="currentColor"
				fillRule="evenodd"
				d="M18.128 2.78c1.886-.538 3.63 1.205 3.09 3.091l-2.8 9.801a4 4 0 01-2.747 2.748l-9.801 2.8c-1.886.539-3.63-1.205-3.091-3.09l2.8-9.802a4 4 0 012.748-2.747l9.8-2.8zM9.498 12a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
				clipRule="evenodd"
			></path>
		</svg>
	);
}
