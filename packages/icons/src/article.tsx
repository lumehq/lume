import { SVGProps } from "react";

export function ArticleIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M20.248 15.25H17.25a2 2 0 0 0-2 2v2.998m4.998-4.998c.002-.026.002-.052.002-.078V5.75a2 2 0 0 0-2-2H5.75a2 2 0 0 0-2 2v12.5a2 2 0 0 0 2 2h9.422c.026 0 .052 0 .078-.002m4.998-4.998a2 2 0 0 1-.584 1.336l-3.078 3.078a2 2 0 0 1-1.336.584M8.75 8.75h6.5m-6.5 4h2.5"
			/>
		</svg>
	);
}
