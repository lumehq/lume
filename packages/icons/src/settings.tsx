import { SVGProps } from "react";

export function SettingsIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="m7.878 5.214-.703-.162a1.77 1.77 0 0 0-2.123 2.123l.162.703a2 2 0 0 1-.84 2.114l-.854.57a1.728 1.728 0 0 0 0 2.876l.855.57a2 2 0 0 1 .84 2.114l-.163.703a1.77 1.77 0 0 0 2.123 2.123l.703-.162a2 2 0 0 1 2.114.84l.57.854a1.728 1.728 0 0 0 2.876 0l.57-.855a2 2 0 0 1 2.114-.84l.703.163a1.77 1.77 0 0 0 2.123-2.123l-.162-.703a2 2 0 0 1 .84-2.114l.854-.57a1.728 1.728 0 0 0 0-2.876l-.855-.57a2 2 0 0 1-.84-2.114l.163-.703a1.77 1.77 0 0 0-2.123-2.123l-.703.162a2 2 0 0 1-2.114-.84l-.57-.854a1.728 1.728 0 0 0-2.876 0l-.57.855a2 2 0 0 1-2.114.84Z"
			/>
			<path
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M14.75 12a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0Z"
			/>
		</svg>
	);
}
