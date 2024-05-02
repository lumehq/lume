import type { SVGProps } from "react";

export function CommunityIcon(
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
				d="M14.606 17.613C13.593 13.981 10.87 12 8 12s-5.594 1.98-6.608 5.613C.861 19.513 2.481 21 4.145 21h7.708c1.663 0 3.283-1.487 2.753-3.387zM3.999 7a4 4 0 118 0 4 4 0 01-8 0zM13.498 7.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM14.194 12.773c1.046 1.136 1.86 2.59 2.339 4.303A4.501 4.501 0 0116.387 20h3.918c1.497 0 2.983-1.344 2.497-3.084-.883-3.168-3.268-4.916-5.8-4.916-.985 0-1.947.264-2.808.773z"
			></path>
		</svg>
	);
}
