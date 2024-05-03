export function NsfwIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M4.75 18.75v1.5a1 1 0 0 0 1 1h12.5a1 1 0 0 0 1-1v-1.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2Zm2-2V12a5.25 5.25 0 0 1 10.5 0v4.75M12 1.75v1.025M21.225 12h1.025M2.775 12H1.75m16.773-6.523.725-.725m-13.771.725-.725-.725M12 16.75v-3"
			/>
		</svg>
	);
}
