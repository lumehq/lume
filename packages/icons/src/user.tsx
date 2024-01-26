import { SVGProps } from "react";

export function UserIcon(
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
				d="M18.995 19.147C18.893 17.393 17.367 16 15.5 16h-7c-1.867 0-3.393 1.393-3.495 3.147m13.99 0A9.97 9.97 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.97 9.97 0 003.005 7.147m13.99 0A9.967 9.967 0 0112 22a9.967 9.967 0 01-6.995-2.853M15 10a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}
