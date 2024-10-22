import type { SVGProps } from "react";

export const PublishIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="none"
		viewBox="0 0 24 24"
		{...props}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M19.432 2.738c.505.54.728 1.327.443 2.133-.606 1.713-1.798 3.124-2.797 4.087a15.74 15.74 0 01-1.045.921l.137.1c.93.684 1.416 1.975.757 3.118-1.221 2.12-4.356 5.803-11.192 5.803a.753.753 0 01-.15-.015A32.702 32.702 0 005.5 21.25a.75.75 0 01-1.5 0c0-4.43.821-8.93 2.909-12.485 2.106-3.587 5.49-6.182 10.492-6.749a2.404 2.404 0 012.031.722z"
			clipRule="evenodd"
		/>
	</svg>
);
