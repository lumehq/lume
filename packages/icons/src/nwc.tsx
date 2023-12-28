export function NwcIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="25"
			fill="none"
			viewBox="0 0 24 25"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<path d="M2 15v-3.5c0-2.8 0-4.2.545-5.27A5 5 0 014.73 4.045C5.8 3.5 7.2 3.5 10 3.5h3.5c1.398 0 2.097 0 2.648.228a3 3 0 011.624 1.624c.207.5.226 1.123.228 2.28M2 15c0 1.33 0 2.495.38 3.413a5 5 0 002.707 2.706c.918.381 2.083.381 4.413.381h5c2.33 0 3.495 0 4.413-.38a5 5 0 002.706-2.707C22 17.495 22 16.33 22 15c0-2.33 0-3.495-.38-4.413a5 5 0 00-2.707-2.706A4.062 4.062 0 0018 7.63M2 15c0-2.33 0-3.495.38-4.413A5 5 0 015.088 7.88C6.005 7.5 7.17 7.5 9.5 7.5h5c1.634 0 2.695 0 3.5.131M14 12.5h3" />
		</svg>
	);
}
