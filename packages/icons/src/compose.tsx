import { SVGProps } from "react";

export function ComposeIcon(
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
				d="M11.162 15.312L13.295 22H8.92l-2.116-6.044m4.358-.644c-1.458.166-2.907.423-4.358.644m4.358-.644a27.427 27.427 0 018.16.296m-12.518.348l-1.632.248a5.126 5.126 0 01-1.699-6.34l4.67-1.824a27.428 27.428 0 007.882-4.733m3.296 12.301c.157.09.303.121.436.086.876-.235.825-3.263-.114-6.765-.938-3.5-2.408-6.15-3.283-5.915-.133.036-.245.136-.335.293m3.296 12.301c-.873-.504-2.052-2.86-2.847-5.83-.796-2.969-.953-5.598-.449-6.471"
			/>
		</svg>
	);
}
