import type { SVGProps } from "react";

export function ComposeFilledIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M19.367 2.814c.565.603.814 1.49.489 2.391-.614 1.705-1.793 3.098-2.765 4.04-.266.256-.52.484-.752.68.894.77 1.345 2.1.652 3.301-1.22 2.116-4.304 5.716-10.928 5.756A32 32 0 0 0 6 21a1 1 0 1 1-2 0c0-4.329.793-8.748 2.831-12.259 2.063-3.553 5.386-6.14 10.288-6.721a2.645 2.645 0 0 1 2.248.794Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
