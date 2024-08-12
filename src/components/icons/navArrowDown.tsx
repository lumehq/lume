import type { SVGProps } from "react";

export function NavArrowDownIcon(
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
				d="M12.925 14.673a21.353 21.353 0 003.88-4.08 1 1 0 00-.881-1.59 51.714 51.714 0 01-7.848 0 1 1 0 00-.881 1.59 21.354 21.354 0 003.88 4.08 1.472 1.472 0 001.85 0z"
			/>
		</svg>
	);
}
