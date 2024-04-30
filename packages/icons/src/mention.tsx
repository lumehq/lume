import { SVGProps } from "react";

export function MentionIcon(
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
				strokeWidth="1.5"
				d="M11.85 13.251c-3.719.065-6.427 2.567-7.18 5.915-.13.575.338 1.084.927 1.084h6.901m-.647-6.999l.147-.001c.353 0 .696.022 1.03.064m-1.177-.063a7.889 7.889 0 00-1.852.249m3.028-.186c.334.042.658.104.972.186m-.972-.186a7.475 7.475 0 011.972.524m3.25 1.412v3m0 0v3m0-3h-3m3 0h3m-5.5-11.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			></path>
		</svg>
	);
}
