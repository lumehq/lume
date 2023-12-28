export function DepotIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<path d="M7 12l2-2-2-2m5 4h3M3 11c0-2.8 0-4.2.545-5.27A5 5 0 015.73 3.545C6.8 3 8.2 3 11 3h2c2.8 0 4.2 0 5.27.545a5 5 0 012.185 2.185C21 6.8 21 8.2 21 11v2c0 2.8 0 4.2-.545 5.27a5 5 0 01-2.185 2.185C17.2 21 15.8 21 13 21h-2c-2.8 0-4.2 0-5.27-.545a5 5 0 01-2.185-2.185C3 17.2 3 15.8 3 13v-2z" />
		</svg>
	);
}
