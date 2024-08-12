import type { SVGProps } from "react";

export function BellIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeWidth="1.5"
				d="M16 18.25c-.673 1.766-2.21 3-4 3s-3.327-1.234-4-3m-2.152 0h12.304a2 2 0 0 0 1.974-2.319l-1.17-7.258a7.045 7.045 0 0 0-13.911 0l-1.171 7.258a2 2 0 0 0 1.974 2.319Z"
			/>
		</svg>
	);
}
