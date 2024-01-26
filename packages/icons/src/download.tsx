import { SVGProps } from "react";

export function DownloadIcon(
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
				d="M3 15a5 5 0 005 5h8a5 5 0 005-5M9 12.188a15 15 0 002.556 2.655c.13.104.287.157.444.157m3-2.812a14.998 14.998 0 01-2.556 2.655A.704.704 0 0112 15m0 0V4"
			/>
		</svg>
	);
}
