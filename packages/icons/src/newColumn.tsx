import type { SVGProps } from "react";

export function NewColumnIcon(
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
				d="M12 19v1a1 1 0 001-1h-1zm8-9a1 1 0 102 0h-2zm0 4a1 1 0 10-2 0h2zm-2 6a1 1 0 102 0h-2zm-2-4a1 1 0 100 2v-2zm6 2a1 1 0 100-2v2zM4 17V7H2v10h2zm8 1H5v2h7v-2zm8-11v3h2V7h-2zM5 6h7V4H5v2zm7 0h7V4h-7v2zm1 13V5h-2v14h2zm5-5v3h2v-3h-2zm0 3v3h2v-3h-2zm-2 1h3v-2h-3v2zm3 0h3v-2h-3v2zm3-11a3 3 0 00-3-3v2a1 1 0 011 1h2zM4 7a1 1 0 011-1V4a3 3 0 00-3 3h2zM2 17a3 3 0 003 3v-2a1 1 0 01-1-1H2z"
			/>
		</svg>
	);
}
