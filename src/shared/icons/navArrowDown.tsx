import { SVGProps } from "react";

export default function NavArrowDownIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title id="navArrowDown">Nav Arrow Down</title>
			<path
				d="M4.29233 7.97419C3.37989 6.14866 4.70668 4 6.74799 4H17.2519C19.2932 4 20.62 6.14866 19.7076 7.97419L14.4556 18.4819C13.4439 20.5061 10.556 20.506 9.54431 18.4819L4.29233 7.97419Z"
				fill="currentColor"
			/>
		</svg>
	);
}
