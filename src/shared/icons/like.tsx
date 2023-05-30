import { SVGProps } from "react";

export function LikeIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M12 5.57193C18.3331 -0.86765 29.1898 11.0916 12 20.75C-5.18982 11.0916 5.66687 -0.867651 12 5.57193Z"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinejoin="round"
			/>
		</svg>
	);
}
