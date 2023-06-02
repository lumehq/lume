import { SVGProps } from "react";

export function FeedIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M19.5 8.75V11.5M19.5 11.5V14.25M19.5 11.5H16.75M19.5 11.5H22.25M14.75 6.5C14.75 8.57107 13.0711 10.25 11 10.25C8.92893 10.25 7.25 8.57107 7.25 6.5C7.25 4.42893 8.92893 2.75 11 2.75C13.0711 2.75 14.75 4.42893 14.75 6.5ZM3.5 20.25C3.86894 16.3254 6.8098 13.25 11 13.25C15.1902 13.25 18.1311 16.3254 18.5 20.25H3.5Z"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
