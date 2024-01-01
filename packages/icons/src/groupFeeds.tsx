import { SVGProps } from "react";

export function GroupFeedsIcon(
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
				d="M7.328 8.191a2.596 2.596 0 110-5.191 2.596 2.596 0 010 5.191zm0 0c1.932 0 3.639.959 4.673 2.426a5.704 5.704 0 014.672-2.426m-9.345 0a5.704 5.704 0 00-4.672 2.426m14.017-2.426a2.596 2.596 0 110-5.191 2.596 2.596 0 010 5.191zm0 0c1.93 0 3.638.959 4.672 2.426M7.328 18.575a2.596 2.596 0 110-5.192 2.596 2.596 0 010 5.192zm0 0c1.932 0 3.639.958 4.673 2.426a5.704 5.704 0 014.672-2.426m-9.345 0A5.704 5.704 0 002.656 21m14.017-2.426a2.596 2.596 0 110-5.192 2.596 2.596 0 010 5.192zm0 0c1.93 0 3.638.958 4.672 2.426"
			/>
		</svg>
	);
}
