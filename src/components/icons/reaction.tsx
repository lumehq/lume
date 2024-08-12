export function ReactionIcon(props: JSX.IntrinsicElements["svg"]) {
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
			<path d="M9 10v1m6.5-.5h-1m-6.07 4A4.985 4.985 0 0012 16a4.985 4.985 0 003.57-1.5M12 21.15a9.15 9.15 0 110-18.3 9.15 9.15 0 010 18.3z" />
		</svg>
	);
}
