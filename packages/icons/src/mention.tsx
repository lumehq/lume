import type { SVGProps } from "react";

export function MentionIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
				d="M16.868 19.867A9.25 9.25 0 1 1 21.25 12c0 1.98-.984 4.024-3.279 3.816a3.312 3.312 0 0 1-2.978-3.767l.53-3.646m-.585 4.077c-.308 2.188-2.109 3.744-4.023 3.474-1.914-.269-3.217-2.26-2.91-4.448.308-2.187 2.11-3.743 4.023-3.474 1.914.27 3.217 2.26 2.91 4.448Z"
			/>
		</svg>
	);
}
