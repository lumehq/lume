import { SVGProps } from "react";

export default function RepostIcon(
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
				d="M17.25 21.25L20.25 18.25L17.25 15.25M6.75 2.75L3.75 5.75L6.75 8.75M5.25 5.75H20.25V10.75M3.75 13.75V18.25H18.75"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
