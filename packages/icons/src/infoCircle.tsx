import { SVGProps } from "react";

export function InfoCircleIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-2 9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-4a1 1 0 0 1-1-1Zm2-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
