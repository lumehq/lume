import { SVGProps } from "react";

export function EditInterestIcon(
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
				d="M15 22h.001M3 20.995L5.727 21c.39 0 .584 0 .767-.043.163-.04.318-.104.46-.191.161-.1.299-.237.574-.514l12.973-13.03c.53-.533.662-1.356.258-2.006a6.321 6.321 0 00-1.932-1.965 1.569 1.569 0 00-1.964.212L3.81 16.573c-.266.267-.398.4-.495.555-.085.138-.149.288-.19.445-.045.177-.05.365-.059.742L3 20.995zM19 15c-.637 1.616-1.34 2.345-3 3 1.66.655 2.363 1.384 3 3 .637-1.616 1.34-2.345 3-3-1.66-.655-2.363-1.384-3-3z"
			/>
		</svg>
	);
}
