import { SVGProps } from "react";

export function ReplyMessageIcon(
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
				d="M1.75 12L11.25 3.75V8.5C19.75 8.5 22 11.75 22 20.25C20.5 17.25 19.75 15.5 11.25 15.5V20.25L1.75 12Z"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinejoin="round"
			/>
		</svg>
	);
}
