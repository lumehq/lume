import { SVGProps } from "react";

export function UserIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M5.857 18.916C7.171 16.996 9.332 15.75 12 15.75c2.668 0 4.83 1.247 6.143 3.166m-12.286 0A9.215 9.215 0 0 0 12 21.25c2.358 0 4.51-.882 6.143-2.334m-12.286 0a9.25 9.25 0 1 1 12.286 0M15.25 10a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
			/>
		</svg>
	);
}
