import type { SVGProps } from "react";

export const ZapIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3.861 11.252l4.6-8a1 1 0 01.867-.502h7.053a1 1 0 01.895 1.447l-1.303 2.606a1 1 0 00.895 1.447h2.467c.891 0 1.337 1.077.707 1.707L9.103 20.897c-.701.7-1.885.063-1.687-.908l1.235-6.039a1 1 0 00-.98-1.2H4.728a1 1 0 01-.867-1.498z"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
