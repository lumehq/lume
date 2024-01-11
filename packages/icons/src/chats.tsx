import { SVGProps } from "react";

export function ChatsIcon(
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="24"
			fill="none"
			viewBox="0 0 25 24"
			{...props}
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M17.55 18.718l1.74.124c.762.055 1.143.082 1.428-.053a1.2 1.2 0 00.57-.57c.136-.286.109-.667.054-1.429l-.124-1.74c-.02-.28-.03-.42-.032-.562-.004-.258-.007-.122.009-.38.009-.142.088-.811.248-2.15A8 8 0 006.884 6.5m7.416 9.1a5.4 5.4 0 10-10.733.856c.096.6.144.9.152.992.012.139.011.107.01.247 0 .093-.008.204-.023.427l-.1 1.386c-.036.515-.055.772.037.964a.81.81 0 00.385.385c.192.091.45.073.964.036l1.385-.099c.224-.015.335-.024.428-.024.14 0 .108-.001.247.011.093.008.393.056.992.152a5.387 5.387 0 005.06-1.942A5.377 5.377 0 0014.3 15.6z"
			/>
		</svg>
	);
}
