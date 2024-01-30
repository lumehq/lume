import { SVGProps } from "react";

export function ArrowUpSquareIcon(
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
				d="M8.5 11.949a20.335 20.335 0 013.604-3.807A.626.626 0 0112.5 8m4 3.949a20.334 20.334 0 00-3.604-3.807A.626.626 0 0012.5 8m0 0v8m0 5c-2.796 0-4.193 0-5.296-.457a6 6 0 01-3.247-3.247C3.5 16.194 3.5 14.796 3.5 12c0-2.796 0-4.193.457-5.296a6 6 0 013.247-3.247C8.307 3 9.704 3 12.5 3c2.796 0 4.194 0 5.296.457a6 6 0 013.247 3.247c.457 1.103.457 2.5.457 5.296 0 2.796 0 4.194-.457 5.296a6 6 0 01-3.247 3.247C16.694 21 15.296 21 12.5 21z"
			/>
		</svg>
	);
}
